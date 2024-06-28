import React from 'react';

interface MessageProps {
    msg: {
        id: string;
        sender: string;
        message: string;
        reactions?: {
            user: string;
            reaction: string;
            messageId: string;
        }[];
    };
    handleReaction: (messageId: string, reaction: string) => void;
}

const Message: React.FC<MessageProps> = ({ msg, handleReaction }) => {
    return (
        <li className="p-4 border rounded shadow flex flex-col">
            <div className="font-bold">{msg.sender}</div>
            <div>{msg.message}</div>
            <div className="mt-2 flex space-x-2">
                {['👍', '❤️', '😂'].map((reaction) => (
                    <button
                        key={reaction}
                        onClick={() => handleReaction(msg.id, reaction)}
                        className="p-1 bg-gray-200 rounded"
                    >
                        {reaction}
                    </button>
                ))}
            </div>
            {msg.reactions && (
                <div className="mt-2 text-sm text-gray-600">
                    {msg.reactions.map((reaction, index) => (
                        <span key={index} className="mr-2">
                            {reaction.user} reacted with {reaction.reaction}
                        </span>
                    ))}
                </div>
            )}
        </li>
    );
};

export default Message;
