import React, { useState } from 'react';

const BirthdayForm = ({ onAdd }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [dob, setDob] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd({ name, phone, dob });
        setName('');
        setPhone('');
        setDob('');
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/20 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Add Birthday</h2>
            <div className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="p-3 rounded-lg bg-black/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                />
                <input
                    type="tel"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="p-3 rounded-lg bg-black/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                />
                <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="p-3 rounded-lg bg-black/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                />
                <button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                    Add Reminder
                </button>
            </div>
        </form>
    );
};

export default BirthdayForm;
