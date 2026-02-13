import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    English: {
        translation: {
            "welcome": "Welcome back",
            "birthdays": "Birthdays",
            "wishes_sent": "Wishes Sent",
            "member_since": "Member Since",
            "edit_profile": "Edit Profile",
            "settings": "Settings",
            "privacy_security": "Privacy & Security",
            "log_out": "Log Out Account",
            "notifications": "Notifications",
            "dark_mode": "Dark Mode",
            "language": "Language",
            "security": "Security",
            "current_password": "Current Password",
            "new_password": "New Password",
            "confirm_password": "Confirm Password",
            "update_password": "Update Password",
            "cancel": "Cancel",
            "save": "Save",
            "full_name": "Full Name",
            "email_address": "Email Address",
        }
    },
    Hindi: {
        translation: {
            "welcome": "वापसी पर स्वागत है",
            "birthdays": "जन्मदिन",
            "wishes_sent": "शुभकामनाएं भेजी गईं",
            "member_since": "सदस्य जब से",
            "edit_profile": "प्रोफ़ाइल संपादित करें",
            "settings": "सेटिंग्स",
            "privacy_security": "गोपनीयता और सुरक्षा",
            "log_out": "लॉग आउट करें",
            "notifications": "सूचनाएं",
            "dark_mode": "डार्क मोड",
            "language": "भाषा",
            "security": "सुरक्षा",
            "current_password": "वर्तमान पासवर्ड",
            "new_password": "नया पासवर्ड",
            "confirm_password": "पासवर्ड की पुष्टि करें",
            "update_password": "पासवर्ड अपडेट करें",
            "cancel": "रद्द करें",
            "save": "सहेजें",
            "full_name": "पूरा नाम",
            "email_address": "ईमेल पता",
        }
    },
    Hinglish: {
        translation: {
            "welcome": "Welcome wapis",
            "birthdays": "Birthdays",
            "wishes_sent": "Wishes Bheji",
            "member_since": "Member Kab Se",
            "edit_profile": "Profile Edit Karein",
            "settings": "Settings",
            "privacy_security": "Privacy & Security",
            "log_out": "Log Out Karein",
            "notifications": "Notifications",
            "dark_mode": "Dark Mode",
            "language": "Bhasha",
            "security": "Security",
            "current_password": "Abhi ka Password",
            "new_password": "Naya Password",
            "confirm_password": "Confirm Password",
            "update_password": "Password Update Karein",
            "cancel": "Cancel",
            "save": "Save",
            "full_name": "Pura Naam",
            "email_address": "Email Address",
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        lng: localStorage.getItem('userSettings') ? JSON.parse(localStorage.getItem('userSettings')).language : 'English',
        fallbackLng: 'English',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
