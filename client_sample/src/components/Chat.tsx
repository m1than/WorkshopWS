import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

interface Message {
    id: string;
    sender: string;
    message: string;
    reactions?: Reaction[];
}

interface Reaction {
    user: string;
    reaction: string;
    messageId: string;
}

const socket: Socket = io('http://localhost:8000');

const Chat: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [users, setUsers] = useState<string[]>([]);

    useEffect(() => {
        socket.on('connect', () => {
            console.log(`Connected to server with id: ${socket.id}`);
        });

        socket.on('message', (data: Message) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        socket.on('users', (users: string[]) => {
            setUsers(users);
        });

        socket.on('reaction', (data: Reaction) => {
            setMessages((prevMessages) =>
                prevMessages.map((msg) =>
                    msg.id === data.messageId ? { ...msg, reactions: [...(msg.reactions || []), data] } : msg
                )
            );
        });

        return () => {
            socket.off('connect');
            socket.off('message');
            socket.off('users');
            socket.off('reaction');
        };
    }, []);

    const handleRegister = () => {
        socket.emit('register', JSON.stringify({ event: 'register', username }));
    };

    const handleMessage = () => {
        socket.emit('message', JSON.stringify({ event: 'message', data: { sender: username, message } }));
        setMessage('');
    };

    const handleReaction = (messageId: string, reaction: string) => {
        socket.emit('reaction', JSON.stringify({ event: 'reaction', username, messageId, reaction }));
    };

    return (
        <div className="flex h-screen">
            <div className="w-1/3 border-r border-gray-200 p-4">
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="p-2 border rounded w-full"
                    />
                    <button onClick={handleRegister} className="mt-2 p-2 bg-blue-500 text-white rounded w-full">
                        Register
                    </button>
                </div>
                <h2 className="text-xl font-bold mb-2">Users</h2>
                <ul className="list-none p-0">
                    {users.map((user, index) => (
                        <li key={index} className="p-2 border-b border-gray-200">
                            {user}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="w-2/3 p-4 flex flex-col">
                <div className="flex-grow overflow-y-auto mb-4">
                    <h2 className="text-xl font-bold mb-2">Messages</h2>
                    <ul className="space-y-4">
                        {messages.map((msg) => (
                            <li key={msg.id} className="p-4 border rounded shadow flex flex-col">
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
                        ))}
                    </ul>
                </div>
                <div className="mt-4">
                    <input
                        type="text"
                        placeholder="Enter your message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="p-2 border rounded w-full"
                    />
                    <button onClick={handleMessage} className="mt-2 p-2 bg-green-500 text-white rounded w-full">
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;
