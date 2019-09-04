export interface Message {
    key?: string;
    channel_type: string;                        // "direct" or "group"
    recipient: string;                           //recipient id
    recipient_fullname: string;
    sender: string;                              //sender id
    sender_fullname: string;
    status: string;                              // sent or deliveried or read
    content: string;                             // text message or image or file path
    timestamp: number;
    type: string                                // text or image or file
}

export enum MessageType {
    Text = 'text',
    Image = 'image'
}
