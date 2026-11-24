if .state == "CLOSED" or (.comments | length) > 0 then "\(.state)\n\(.comments | map(.body) | join("\n---\n"))" else "" end
