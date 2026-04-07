import openmeteo_requests
import requests_cache
from retry_requests import retry
import pandas as pd
from datetime import datetime

def get_seasonal_weather_averages(lat: float, lon: float, season: str):
    """
    Fetches historical weather data for the last complete agricultural season
    to act as a reliable proxy for current conditions.
    - Kharif (Monsoon): June to September
    - Rabi (Winter): October to March
    - Summer (Zaid): April to June
    """
    cache_session = requests_cache.CachedSession('.cache', expire_after=3600)
    retry_session = retry(cache_session, retries=5, backoff_factor=0.2)
    openmeteo = openmeteo_requests.Client(session=retry_session)

    # --- NEW, MORE ROBUST DATE LOGIC ---
    # We always use the previous year's season as a historical baseline.
    last_year = datetime.now().year - 1
    season_str = season.lower()

    if season_str == 'kharif':
        start_date = f"{last_year}-06-01"
        end_date = f"{last_year}-09-30"
    elif season_str == 'rabi':
        # Rabi season spans two years (e.g., Oct 2024 to Mar 2025)
        start_date = f"{last_year}-10-01"
        end_date = f"{last_year + 1}-03-31"
    elif season_str == 'summer':
        # Summer season is in the next calendar year relative to the start of the agricultural cycle
        start_date = f"{last_year + 1}-04-01"
        end_date = f"{last_year + 1}-06-30"
    else:
        # Fallback for any unknown season string
        print(f"Warning: Unknown season '{season}'. Defaulting to weather from the last 90 days.")
        end_date = datetime.now().strftime("%Y-%m-%d")
        start_date = (datetime.now() - pd.DateOffset(months=3)).strftime("%Y-%m-%d")

    url = "https://archive-api.open-meteo.com/v1/archive"
    params = {
        "latitude": lat, "longitude": lon, "start_date": start_date, "end_date": end_date,
        "daily": ["temperature_2m_mean", "relative_humidity_2m_mean", "precipitation_sum"],
        "timezone": "auto"
    }
    
    responses = openmeteo.weather_api(url, params=params)
    response = responses[0]

    daily = response.Daily()
    daily_data = {
        "date": pd.to_datetime(daily.Time(), unit="s"),
        "temperature_2m_mean": daily.Variables(0).ValuesAsNumpy(),
        "relative_humidity_2m_mean": daily.Variables(1).ValuesAsNumpy(),
        "precipitation_sum": daily.Variables(2).ValuesAsNumpy()
    }

    daily_df = pd.DataFrame(data=daily_data)
    daily_df.dropna(inplace=True)
    
    if daily_df.empty:
        raise ValueError(f"No weather data found for the specified period: {start_date} to {end_date}")

    # Calculate averages over the entire seasonal period
    seasonal_averages = daily_df.mean(numeric_only=True)

    # --- IMPROVED RAINFALL CALCULATION AND COMMENT ---
    return {
        "temperature": float(seasonal_averages.get('temperature_2m_mean', 0)),
        "humidity": float(seasonal_averages.get('relative_humidity_2m_mean', 0)),
        # Convert average daily rainfall to an approximate average monthly total
        "rainfall": float(seasonal_averages.get('precipitation_sum', 0) * 30)
    }