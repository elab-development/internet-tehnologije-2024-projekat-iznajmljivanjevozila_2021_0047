function WeatherBG() {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                setLoading(true);
                const res = await fetch("https://wttr.in/Belgrade?format=j1");
                const data = await res.json();
                const current = data.current_condition[0];
                setWeather({
                    temp: current.temp_C,
                    humidity: current.humidity,
                    wind: current.windspeedKmph,
                    description: current.weatherDesc[0].value,
                });
                setError(null);
            } catch {
                setError("Ne mogu da dohvatim podatke o vremenu.");
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, []);

    if (loading) return <p style={styles.weatherLoading}>Učitavanje vremenske prognoze...</p>;
    if (error) return <p style={styles.weatherError}>{error}</p>;

    return (
        <div style={styles.weatherCard}>
            <h2 style={styles.weatherTitle}>Vreme u Beogradu</h2>
            <p><strong>Temperatura:</strong> {weather.temp}°C</p>
            <p><strong>Vlažnost:</strong> {weather.humidity}%</p>
            <p><strong>Vetar:</strong> {weather.wind} km/h</p>
            <p><strong>Stanje:</strong> {weather.description}</p>
        </div>
    );
}
