import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CurrencyContext = createContext();

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider = ({ children }) => {
    const [currency, setCurrency] = useState("EUR");
    const [rates, setRates] = useState({ EUR: 1 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("http://localhost:8000/api/valute")
            .then(res => {
                setRates(res.data.rates);
            })
            .catch(() => {
                setRates({ EUR: 1 });
            })
            .finally(() => setLoading(false));
    }, []);

    const convert = (amount) => {
        const rate = rates[currency] || 1;
        return (amount * rate).toFixed(2);
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, rates, convert, loading }}>
            {children}
        </CurrencyContext.Provider>
    );
};