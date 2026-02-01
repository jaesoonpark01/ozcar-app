import { useState, useEffect } from 'react'
import { translations, Language, TranslationKey } from '../lib/translations'

export function useI18n() {
    const [lang, setLang] = useState<Language>('ko')

    // Load language from localStorage on mount
    useEffect(() => {
        const savedLang = localStorage.getItem('ozcar_lang') as Language
        if (savedLang && (savedLang === 'ko' || savedLang === 'en')) {
            setLang(savedLang)
        }
    }, [])

    const toggleLanguage = () => {
        const newLang = lang === 'ko' ? 'en' : 'ko'
        setLang(newLang)
        localStorage.setItem('ozcar_lang', newLang)
    }

    const t = (key: TranslationKey): string => {
        return translations[lang][key] || key
    }

    return { lang, toggleLanguage, t }
}
