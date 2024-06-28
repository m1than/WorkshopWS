import React, { useState, useEffect } from 'react';
import { WebsocketClient } from '../api/websocket';
import HttpClient from '../api/http';
import Message from '../components/Message';
import User from "../components/User";

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

const Chat: React.FC = () => {
    const socket = new WebsocketClient();
    const httpClient = new HttpClient();

    const [username, setUsername] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [users, setUsers] = useState<string[]>([]);

    useEffect(() => {
        const fetchInitialData = async () => {
            const messages = await httpClient.getMessages();
            const users = await httpClient.getUsers();
            setMessages(messages);
            setUsers(users);
        };

        fetchInitialData();

        socket.on('connect', () => {
            console.log(`Connected to server with id: ${socket.entryPoint.id}`);
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
        if (username.trim()) {
            socket.register(username);
        }
    };

    const handleSendMessage = () => {
        if (message.trim()) {
            socket.sendMessage(username, message);
            setMessage('');
        }
    };

    const handleReaction = (messageId: string, reaction: string) => {
        socket.emit('reaction', JSON.stringify({ event: 'reaction', username, messageId, reaction }));
    };

    return (
        <div className="flex h-screen">
            <User username={username} setUsername={setUsername} handleRegister={handleRegister} users={users} />
            <div className="w-2/3 p-4 flex flex-col">
                <div className="flex-grow overflow-y-auto mb-4">
                    <h2 className="text-xl font-bold mb-2">Messages</h2>
                    <ul className="space-y-4">
                        {messages.map((msg) => (
                            <Message key={msg.id} msg={msg} handleReaction={handleReaction} />
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
                    <button onClick={handleSendMessage} className="mt-2 p-2 bg-green-500 text-white rounded w-full">
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;
