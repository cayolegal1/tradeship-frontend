import { checkTick, cubeIcon, infoIcon, uploadIcon, vaultIcon } from "@/base/SVG";
import { CustomButton } from "@/components/custom-button/custom-button";
import styles from "../trade.module.scss";

export default function Labels() {
  return (
    <section className={styles["labels"]}>
      <div className="auto__container">
        <div className={styles["labels__inner"]}>
          <div className={styles["labels__inner-title"]}>
            <h1>Shipping Labels</h1>
            <p>Choose how you'd like to handle shipping for this trade</p>
          </div>
          <div className={styles["labelsInfo"]}>
            {infoIcon}
            <p>Enjoy discounted USPS/UPS rates through TradeShip.</p>
          </div>
          <div className={styles["labels__row"]}>
            <div className={styles["labelsCol"]}>
              <div className={styles["labelsCol__top"]}>
                <div className={styles["labelsCol__icon"]}>{cubeIcon}</div>
                <div className={styles["labelsCol__title"]}>
                  <h3>Buy Label via TradeShip</h3>
                  <p>Get discounted shipping rates</p>
                </div>
              </div>
              <ul>
                <li>Discounted USPS & UPS rates</li>
                <li>Automatic tracking integration</li>
                <li>Print-ready labels</li>
                <li>Package protection available</li>
              </ul>
              <div className={styles["labelsCol__foot"]}>
                <CustomButton
                  title="Buy Label via TradeShip"
                  styleType="primary"
                />
              </div>
            </div>
            <div className={styles["labelsCol"]}>
              <div className={styles["labelsCol__top"]}>
                <div className={styles["labelsCol__icon"]}>{uploadIcon}</div>
                <div className={styles["labelsCol__title"]}>
                  <h3>Upload My Own Label</h3>
                  <p>Use your own shipping service</p>
                </div>
              </div>
              <ul>
                <li>Use your preferred carrier</li>
                <li>Enter tracking manually</li>
                <li>Manage your own shipping costs</li>
                <li>Full control over service level</li>
              </ul>
              <div className={styles["labelsCol__foot"]}>
                <CustomButton title="Upload My Own Label" styleType="secondary" />
              </div>
            </div>
          </div>
          <div className={styles["labelsContent"]}>
            <div className={styles["labelsContent__title"]}>
              <h3> {vaultIcon} Package Protection (Vault Trades Only)</h3>
              <p>Protect your shipment against loss or damage</p>
            </div>
            <label className={styles["check"]}>
              <div className={styles["check__box"]}>
                <input type="checkbox" />
                <span>{checkTick}</span>
              </div>
              <p>Add package protection for $2.99</p>
            </label>
            <p>
              Covers up to $500 in case of loss, theft, or damage during
              shipping. Only available for Vault trades with escrow protection.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
