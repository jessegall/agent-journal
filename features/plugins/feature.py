from features.base import Feature


class Plugins(Feature):
    name = "plugins"
    title_ = "Plugins"
    abstract_ = "A repository installed into the journal hears the bus, answers it, and may run services of its own"
    help_ = "Install one with journal plugin install <url>: its .journal-plugin/plugin.json says what it listens to, what it runs and which pages it shows. A plugin runs as you; install shows every command before it runs any."
    fixed = True
