# Waterloo Zone Change Requests - Reddit Bot

Simple bot used to update [/r/WaterlooZoneChanges/](https://www.reddit.com/r/WaterlooZoneChanges/) with new zone change requests. It simply creates a new post containing every request.

Relies on data provided by the backend server. For more information, please refer to [backend README](../backend/README.md). It simply fetches data from the server at a fixed interval.

## Setting up credentials

If you wish to run this bot against your own subreddit, you first need to create a file named `credentials.json`. Simply update `credentials.example.json`, and then

```
cp credentials.example.json credentials.json
```

You can obtain credentials through https://www.reddit.com/prefs/apps


## Environment variables

Please modify `constants.json` if you:

* Have your backend running in a different host;

* Wish to modify the rate at which the bot checks for updates, since it is not event-driven;

* Are planning to run against a different subreddit.