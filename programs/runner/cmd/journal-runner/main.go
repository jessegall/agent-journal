// Command journal-runner is the journal's runner: it hands Docker the containers the journal sends and relays
// what they print back.
package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"maps"
	"os"
	"strings"
	"time"
)

func main() {
	if len(os.Args) == 3 && os.Args[1] == "capture-hook" {
		if err := captureHook(os.Args[2]); err != nil {
			fmt.Fprintln(os.Stderr, "journal-runner:", err)
			os.Exit(1)
		}
		os.Exit(0)
	}

	hostCommands := map[string]func([]string) error{
		"enroll": enroll, "serve": serve,
		"install": install, "installation": installation, "status-line": statusLine,
		"connect":         connect,
		"install-release": installRelease, "relay": relay, "upgrade-binding": upgradeBinding, "protocol": protocolOnly,
	}
	maps.Copy(hostCommands, developmentCommands)
	if len(os.Args) >= 2 && hostCommands[os.Args[1]] != nil {
		if err := hostCommands[os.Args[1]](os.Args[2:]); err != nil {
			fmt.Fprintln(os.Stderr, "journal-runner:", err)
			var coded exitCodeError
			if errors.As(err, &coded) {
				os.Exit(coded.code)
			}
			os.Exit(1)
		}
		os.Exit(0)
	}

	fmt.Fprintln(os.Stderr, "usage: journal-runner <enroll|serve|relay|install|installation|connect> [options]")
	os.Exit(2)
}

// captureHook appends one hook payload, with the time it arrived, to the capture file and answers the program with
// an empty object, so the hook neither allows nor denies anything.
func captureHook(capture string) error {
	payload, err := io.ReadAll(os.Stdin)
	if err != nil {
		return err
	}

	file, err := os.OpenFile(capture, os.O_CREATE|os.O_APPEND|os.O_WRONLY, 0o644)
	if err != nil {
		return err
	}
	defer file.Close()

	line, err := json.Marshal(map[string]any{"at": time.Now().UTC().Format(time.RFC3339Nano), "payload": json.RawMessage(strings.TrimSpace(string(payload)))})
	if err != nil {
		return err
	}
	if _, err := file.Write(append(line, '\n')); err != nil {
		return err
	}

	fmt.Print("{}")

	return nil
}
