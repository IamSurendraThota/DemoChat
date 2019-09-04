export interface Conversation {
    key?: string;
    channelType: string;
    isNew: boolean;
    lastMessageText: string;
    recipient: string;
    recipient_fullname: string;
    sender: string;
    sender_fullname: string;
    timestamp: number;
}
