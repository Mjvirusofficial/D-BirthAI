import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Bell, Calendar, Gift, ChevronRight, Star, Sparkles, Heart } from 'lucide-react';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { type: "spring", stiffness: 100, damping: 20 }
    }
};

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-white relative overflow-hidden font-sans pt-20">
            {/* Animated Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 50, 0],
                        y: [0, 30, 0]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[10%] -right-[10%] w-[60vh] h-[60vh] bg-[#FDE047] rounded-full blur-[120px] opacity-20"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        x: [0, -40, 0],
                        y: [0, 20, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[20%] -left-[10%] w-[50vh] h-[50vh] bg-[#63b0b8] rounded-full blur-[100px] opacity-15"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        y: [0, -50, 0]
                    }}
                    transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-[10%] right-[20%] w-[55vh] h-[55vh] bg-[#EC4899] rounded-full blur-[120px] opacity-20"
                />
            </div>

            {/* Hero Section */}
            <section className="relative z-10 pt-8 pb-16 sm:pt-16 sm:pb-24">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="max-w-4xl mx-auto space-y-8"
                    >
                        {/* Animated Birthday Scene Above Badge */}
                        <div className="relative w-full h-32 flex justify-center items-end overflow-visible pointer-events-none -mt mb-0">
                            {/* Confetti Explosion */}
                            {[...Array(30)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ y: -50, x: 0, opacity: 0, scale: 0 }}
                                    animate={{
                                        y: [0, 150 + Math.random() * 50],
                                        x: (Math.random() - 0.5) * 400,
                                        opacity: [0, 1, 1, 0],
                                        scale: [0, 1, 1, 0],
                                        rotate: Math.random() * 720
                                    }}
                                    transition={{ delay: 6, duration: 3, ease: "easeOut", repeat: Infinity, repeatDelay: 1 }}
                                    className="absolute top-0 w-2 h-2 rounded-full z-[60]"
                                    style={{
                                        backgroundColor: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'][i % 6],
                                        left: '50%'
                                    }}
                                />
                            ))}

                            {/* Cake (From LEFT) */}
                            <motion.div
                                initial={{ x: -180, opacity: 0 }}
                                animate={{ x: -50, opacity: [0, 1, 1, 0] }}
                                transition={{ duration: 6, times: [0, 0.1, 0.9, 1], ease: "easeInOut" }}
                                className="absolute bottom-4 left-1/2 -ml-10 z-50"
                            >
                                <div className="bg-white rounded-full shadow-lg border-4 border-pink-200 overflow-hidden flex items-center justify-center w-20 h-20">
                                    <img src="cake.gif" alt="Cake" className="w-full h-full object-cover mix-blend-multiply" />
                                </div>
                            </motion.div>

                            {/* Walker (From RIGHT) */}
                            <motion.div
                                initial={{ x: 180, opacity: 0 }}
                                animate={{ x: 50, opacity: [0, 1, 1, 0] }}
                                transition={{ duration: 6, times: [0, 0.1, 0.9, 1], ease: "easeInOut" }}
                                className="absolute bottom-4 left-1/2 -ml-10 z-50"
                            >
                                <div className="bg-white rounded-full shadow-lg border-4 border-blue-200 overflow-hidden flex items-center justify-center w-16 h-16">
                                    <img src="walk2.gif" alt="Walker" className="w-full h-full object-cover mix-blend-multiply transform scale-x-[-1]" />
                                </div>
                            </motion.div>

                            {/* Computer Celebration (Appears at 6s) */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 6, duration: 0.5, type: "spring" }}
                                className="absolute bottom-2 left-1/2 -translate-x-1/2 z-50"
                            >
                                <img src="computer.gif" alt="Celebration" className="w-36 h-36 object-contain mix-blend-multiply" />
                            </motion.div>

                            {/* Fun Text */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 6.2, duration: 0.5 }}
                                className="absolute z-[60] bottom-0 w-full text-center"
                            >
                                <span className="text-[14px] font-black text-purple-600 tracking-widest uppercase drop-shadow-sm">✨ Happy Birthday! ✨</span>
                            </motion.div>
                        </div>

                        {/* Badge */}
                        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/50 backdrop-blur-md border border-gray-100 shadow-xl shadow-purple-500/5 mb-4">
                            <Sparkles className="w-4 h-4 text-[#A855F7]" />
                            <span className="text-sm font-black text-[#A855F7] tracking-widest uppercase">The Future of Celebrations</span>
                        </motion.div>

                        {/* Title */}
                        <motion.h1 variants={itemVariants} className="text-5xl sm:text-7xl font-black tracking-tighter leading-[0.9] text-gray-900 drop-shadow-sm">
                            Make Every <br />
                            <span className="relative inline-block text-[#63b0b8]">
                                Birthday
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ delay: 1, duration: 1 }}
                                    className="absolute -bottom-2 left-0 h-3 bg-[#FDE047]/40 -z-10 rounded-full"
                                />
                            </span> Special.
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p variants={itemVariants} className="text-xl sm:text-2xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium">
                            The smartest way to track birthdays, automate wishes, and spread love. Let AI handle the reminders while you bring the joy. ✨
                        </motion.p>

                        {/* CTAs */}
                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
                            <Link to="/register">
                                <motion.button
                                    whileHover={{ scale: 1.05, y: -4 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-10 py-5 bg-[#63b0b8] text-white font-black rounded-[24px] flex items-center gap-3 shadow-2xl shadow-teal-500/20 text-lg group transition-all"
                                >
                                    Get Started Free
                                    <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                            </Link>
                            <Link to="/login">
                                <motion.button
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-10 py-5 bg-white text-gray-800 font-black rounded-[24px] border border-gray-100 shadow-xl shadow-gray-200 transition-all text-lg"
                                >
                                    Login Now
                                </motion.button>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="relative z-10 py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-10"
                    >
                        <FeatureCard
                            icon={<Calendar className="w-8 h-8 text-[#A855F7]" />}
                            title="Smart Reminders"
                            description="Never miss a date with our intelligent notification system that alerts you exactly when needed."
                            bgColor="bg-purple-50"
                        />
                        <FeatureCard
                            icon={<Sparkles className="w-8 h-8 text-[#63b0b8]" />}
                            title="AI Wishes"
                            description="Let our AI craft the perfect, personalized message that resonates with your loved ones."
                            bgColor="bg-teal-50"
                        />
                        <FeatureCard
                            icon={<Heart className="w-8 h-8 text-[#EC4899]" />}
                            title="Auto Send"
                            description="Schedule messages in advance and we'll deliver them right on time, across any platform."
                            bgColor="bg-pink-50"
                        />
                    </motion.div>
                </div>
            </section>

            {/* Statistic / Trust Section */}
            <section className="relative z-10 py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="bg-[#FDE047]/10 border border-[#FDE047]/20 rounded-[40px] p-12 text-center space-y-6">
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Trust by thousands of happy celebrants</h2>
                        <div className="flex flex-wrap justify-center gap-12">
                            {[
                                { label: "Birthdays Tracked", value: "10k+" },
                                { label: "Wishes Sent", value: "50k+" },
                                { label: "Happy Users", value: "5k+" }
                            ].map((stat, i) => (
                                <div key={i} className="space-y-1">
                                    <div className="text-4xl font-black text-[#63b0b8]">{stat.value}</div>
                                    <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, description, bgColor }) => (
    <motion.div
        whileHover={{ y: -10 }}
        className="p-10 rounded-[40px] bg-white border border-gray-50 shadow-2xl shadow-gray-100 flex flex-col items-center text-center space-y-6 transition-all group"
    >
        <div className={`p-6 rounded-[24px] ${bgColor} transform group-hover:scale-110 transition-transform`}>
            {icon}
        </div>
        <h3 className="text-2xl font-black text-gray-900">{title}</h3>
        <p className="text-gray-500 font-medium leading-relaxed">
            {description}
        </p>
    </motion.div>
);

export default LandingPage;

