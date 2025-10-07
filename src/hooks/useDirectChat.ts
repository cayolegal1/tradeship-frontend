import { useNavigate } from "react-router-dom";
import { ChatRepository } from "@/repositories";
import { toast } from "react-toastify";

export const useDirectChat = () => {
  const navigate = useNavigate();

  const openDirectChat = async (
    recipientId: number,
    initialMessage?: string
  ) => {
    try {
      // Create or get existing conversation with the recipient
      const conversation = await ChatRepository.createTradeConversation({
        recipientId,
      });

      // Navigate to messages page with the specific conversation
      navigate(`/messages?conversation=${conversation.id}`);

      toast.success("Chat opened successfully!");
    } catch (error) {
      console.error("Error opening direct chat:", error);
      toast.error("Failed to open chat. Please try again.");
    }
  };

  return { openDirectChat };
};
