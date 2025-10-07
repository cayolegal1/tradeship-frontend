import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { closeIcon } from "@/base/SVG";
import { CustomButton } from "@/components/custom-button/custom-button";
import { tradeRequestApi } from "@/services/api/trade-requests";
import { ItemRepository } from "@/repositories";
import type { CreateTradeRequestDto, Item } from "@/types";
import styles from "./create-trade-request-modal.module.scss";

interface CreateTradeRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientId: number;
  requestedItem: Item;
  onSuccess?: (tradeRequestId: number) => void;
}

export const CreateTradeRequestModal: React.FC<
  CreateTradeRequestModalProps
> = ({ isOpen, onClose, recipientId, requestedItem, onSuccess }) => {
  const [formData, setFormData] = useState<CreateTradeRequestDto>({
    recipientId,
    requestedItemId: requestedItem.id,
    message: "",
  });
  const [myItems, setMyItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingItems, setLoadingItems] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadMyItems();
    }
  }, [isOpen]);

  const loadMyItems = async () => {
    try {
      setLoadingItems(true);
      const response = await ItemRepository.getUserItems();
      setMyItems(
        response.results.filter(
          (item) => item.isActive && item.isAvailableForTrade
        )
      );
    } catch (error) {
      console.error("Error loading items:", error);
      toast.error("Error loading your items");
    } finally {
      setLoadingItems(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.proposedItemId && !formData.cashAmount) {
      toast.error("Please select an item to trade or add cash amount");
      return;
    }

    try {
      setLoading(true);
      const response = await tradeRequestApi.createTradeRequest(formData);
      toast.success("Trade request sent successfully!");
      onSuccess?.(response.id);
      onClose();
    } catch (error: unknown) {
      console.error("Error creating trade request:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Error sending trade request";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof CreateTradeRequestDto,
    value: string | number | undefined
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const closeModal = (e: React.MouseEvent) => {
    if (e.currentTarget === e.target) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={styles.overlay}
      onClick={closeModal}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={styles.modal}
      >
        <div className={styles.header}>
          <h3>Create Trade Request</h3>
          <button
            type="button"
            onClick={onClose}
            className={styles.closeButton}
          >
            {closeIcon}
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.requestedItem}>
            <h4>Requesting:</h4>
            <div className={styles.itemCard}>
              <img
                src={requestedItem.primaryImage || "/placeholder.png"}
                alt={requestedItem.name}
                className={styles.itemImage}
              />
              <div className={styles.itemInfo}>
                <h5>{requestedItem.name}</h5>
                <p>${requestedItem.price}</p>
                <p>From: {requestedItem.owner.username}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="proposedItem">
                Your Item to Trade (Optional)
              </label>
              {loadingItems ? (
                <div className={styles.loading}>Loading your items...</div>
              ) : (
                <select
                  id="proposedItem"
                  value={formData.proposedItemId || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "proposedItemId",
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  className={styles.select}
                >
                  <option value="">Select an item to trade</option>
                  {myItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} - ${item.price}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="cashAmount">Additional Cash (Optional)</label>
              <input
                type="number"
                id="cashAmount"
                min="0"
                step="0.01"
                value={formData.cashAmount || ""}
                onChange={(e) =>
                  handleInputChange(
                    "cashAmount",
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                placeholder="0.00"
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message">Message (Optional)</label>
              <textarea
                id="message"
                value={formData.message || ""}
                onChange={(e) => handleInputChange("message", e.target.value)}
                placeholder="Add a message to explain your trade offer..."
                rows={4}
                maxLength={1000}
                className={styles.textarea}
              />
              <div className={styles.charCount}>
                {(formData.message || "").length}/1000
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="expiresAt">Expires At (Optional)</label>
              <input
                type="datetime-local"
                id="expiresAt"
                value={
                  formData.expiresAt
                    ? new Date(formData.expiresAt).toISOString().slice(0, 16)
                    : ""
                }
                onChange={(e) =>
                  handleInputChange(
                    "expiresAt",
                    e.target.value
                      ? new Date(e.target.value).toISOString()
                      : undefined
                  )
                }
                className={styles.input}
              />
            </div>

            <div className={styles.actions}>
              <CustomButton
                type="button"
                title="Cancel"
                styleType="solid"
                onClick={onClose}
                disabled={loading}
              />
              <CustomButton
                type="submit"
                title={loading ? "Sending..." : "Send Trade Request"}
                styleType="primary"
                disabled={loading}
              />
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};
