export interface Channel {
    name: string;
    data: any;
    meta: {
        color: string;
    };
}

export interface Message {
    text: string;
    time: string;
}