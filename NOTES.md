# Notes

- Filter the data for companies Apple (AAPL), Spotify (SPOT), and JPMorgan Chase (JPM)
- Implement a caching layer for the ticker → CIK map (`company_tickers.json`): fetch it once, hold it in memory, and refresh it every 24 hours instead of re-fetching on every request, since it's a large, slow-changing payload.
- If had time, also map and cache each CIK's company submission response (`CIK{cik}.json`) for corresponding ticker.
