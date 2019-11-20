# Waterloo Zone Changes Requests Scrapper

Scrapper for zone change requests in the City of Waterloo, found [here](https://www.waterloo.ca/en/government/zone-changes.aspx).

## Installing dependencies and testing

```
npm install
npm test
```

## Limitations

### Why am I getting the following 429 message?

```
Unable to extract coordinates for zoneChange lodgest. StatusCode: 429, Details: null. Skipping...
```

The original page contains minified Google Maps links, which the scrapper tries to convert to coordinates.
For this to happen, it needs access to the unminified URL, by making a HTTP request. If it receives a `429` response,
it means too many requests have been made. You can either wait, or circumvent this by using a VPN.
