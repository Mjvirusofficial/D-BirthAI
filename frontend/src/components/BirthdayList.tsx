import React from 'react';

const BirthdayList = ({ birthdays, onDelete }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {birthdays.map((birthday) => (
                <div key={birthday._id} className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/20 relative group hover:bg-white/20 transition-all duration-300">
                    <h3 className="text-xl font-bold text-white">{birthday.name}</h3>
                    <p className="text-gray-300">📞 {birthday.phone}</p>
                    <p className="text-purple-300">🎂 {new Date(birthday.dob).toLocaleDateString()}</p>
                    <button
                        onClick={() => onDelete(birthday._id)}
                        className="absolute top-4 right-4 text-red-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        🗑️
                    </button>
                </div>
            ))}
        </div>
    );
};

export default BirthdayList;
