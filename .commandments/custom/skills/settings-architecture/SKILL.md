---
name: SettingsArchitecture
description: Load it before declaring a setting, reading one, or writing code that reaches a tunnel in version 5, so every setting has one declaration and every tunnel one contract.
summary: A setting is declared once, with its type and default, and read through SettingValues; a secret has no default; only src/tunnels names a tunnel or imports one, and a tunnel keeps no credential in its code.
tier: mandatory
languages: [python]
---

# The settings and tunnels architecture

Version 5 declares each module's settings as a tree of SettingGroup and SettingValue nodes; the full key is the
module's name and the node's path (plan 1079). A tunnel is a module under src/tunnels that declares a Tunnel; the
service setting of journal.core.tunnel chooses one, and the rest of the journal knows only the contract.

## When it fires

- **`secret-setting-with-default`** - a SettingValue with `secret` also has a `default`. A secret is set by the
  person with journal setting set; it has no value in the code.
- **`setting-read-with-own-default`** - a read through SettingValues is followed by `or <value>`. The default
  belongs in the declaration, which SettingValues answers when nothing is set.
- **`tunnel-module-imported-outside-tunnels`** - code outside src/tunnels imports a tunnel module. Use
  Tunnels.chosen() or ServerTunnel; the module finder alone lists src/tunnels by its path.
- **`tunnel-named-outside-tunnels`** - the core, the server or a suite names a tunnel service in a string. Ask the
  Tunnel contract for its address, state and reason instead.
- **`secret-literal-in-tunnel`** - a tunnel module assigns a token, a password or a secret a value. Its program's
  own login, or a secret setting, holds it.
- **`plain-setting-text`** - a setting's title or description uses the journal's voice or a word from inside the
  journal. Say what the setting changes, for a reader seeing it the first time.
