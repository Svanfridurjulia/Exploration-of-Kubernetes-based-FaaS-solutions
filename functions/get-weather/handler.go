package function

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

type WeatherData struct {
	Latitude         float64 `json:"latitude"`
	Longitude        float64 `json:"longitude"`
	GenerationTimeMs float64 `json:"generationtime_ms"`
	UtcOffsetSeconds int     `json:"utc_offset_seconds"`
	Timezone         string  `json:"timezone"`
	TimezoneAbbrev   string  `json:"timezone_abbreviation"`
	Elevation        float64 `json:"elevation"`
	HourlyUnits      struct {
		Time        string `json:"time"`
		Temperature string `json:"temperature_2m"`
	} `json:"hourly_units"`
	Hourly struct {
		Time        []string  `json:"time"`
		Temperature []float64 `json:"temperature_2m"`
	} `json:"hourly"`
}

func Handle(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte(fmt.Sprintf("(Changed 20:04) \n")))

	var weatherData WeatherData
	url := fmt.Sprintf("https://api.open-meteo.com/v1/forecast?latitude=64.14&longitude=-21.90&hourly=temperature_2m&current_weather=true&forecast_days=1")

	resp, err := http.Get(url)

	if err != nil {
		w.Write([]byte(fmt.Sprintf("Error when connecting with vedur.is \n")))
	}

	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)

	if err != nil {
		w.Write([]byte(fmt.Sprintf("Error when reading from vedur.is \n")))
	}

	err = json.Unmarshal(body, &weatherData)

	if err != nil {
		w.Write([]byte(fmt.Sprintf("Error when parsing JSON \n")))
	}

	output := "Today is " + weatherData.Hourly.Time[0][:10] + "\nThe forecast for Reykjavík is: \n"

	for i := 0; i < len(weatherData.Hourly.Temperature); i++ {
		temp := fmt.Sprintf("%.f", weatherData.Hourly.Temperature[i])
		output = output + weatherData.Hourly.Time[i][11:] + ": " + temp + "°C\n"
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(fmt.Sprintf("%s", output)))
}
