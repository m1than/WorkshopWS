import React from 'react';

interface UserProp {
    username: string;
    setUsername: React.Dispatch<React.SetStateAction<string>>;
    handleRegister: () => void;
    users: string[];
}

const User: React.FC<UserProp> = ({ username, setUsername, handleRegister, users }) => {
    return (
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
    );
};

export default User;
