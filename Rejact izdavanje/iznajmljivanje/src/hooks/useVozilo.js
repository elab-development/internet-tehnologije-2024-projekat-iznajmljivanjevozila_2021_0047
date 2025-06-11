import { useEffect, useState } from 'react';
import axios from 'axios';

const useVozilo = (id_vozila) => {
    const [vozilo, setVozilo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id_vozila) return;

        setLoading(true);
        axios.get('http://localhost:8000/api/voziloJedno', {
            params: { id_vozila }
        })
            .then(res => {
                setVozilo(res.data);
                setError('');
            })
            .catch(() => {
                setError('Greška pri učitavanju vozila.');
                setVozilo(null);
            })
            .finally(() => setLoading(false));
    }, [id_vozila]);

    return { vozilo, loading, error };
};

export default useVozilo;