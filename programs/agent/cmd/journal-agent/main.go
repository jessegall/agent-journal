// Command journal-agent is the journal's host for agent drivers. For now it records evidence sessions.
package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"journal-agent/hostapi"
	"maps"
	"os"
	"strings"
	"time"

	"journal-agent/recording"
	"journal-agent/screen"
)

// secretToggle is the key (Ctrl-]) that turns secret marking of typed input on and off; it is never forwarded.
const secretToggle = 0x1d

func main() {
	if len(os.Args) == 3 && os.Args[1] == "capture-hook" {
		if err := captureHook(os.Args[2]); err != nil {
			fmt.Fprintln(os.Stderr, "journal-agent:", err)
			os.Exit(1)
		}
		os.Exit(0)
	}

	if len(os.Args) == 3 && os.Args[1] == "annotate" {
		if err := annotate(os.Args[2]); err != nil {
			fmt.Fprintln(os.Stderr, "journal-agent:", err)
			os.Exit(1)
		}
		os.Exit(0)
	}

	if len(os.Args) == 4 && os.Args[1] == "recording" && os.Args[2] == "render" {
		rendered, err := hostapi.RenderFolder(os.Args[3])
		if err != nil {
			fmt.Fprintln(os.Stderr, "journal-agent:", err)
			os.Exit(1)
		}
		fmt.Printf("rendered %d recordings\n", len(rendered))
		os.Exit(0)
	}

	if len(os.Args) == 3 && os.Args[1] == "screen" {
		if err := printScreen(os.Args[2]); err != nil {
			fmt.Fprintln(os.Stderr, "journal-agent:", err)
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
			fmt.Fprintln(os.Stderr, "journal-agent:", err)
			var coded exitCodeError
			if errors.As(err, &coded) {
				os.Exit(coded.code)
			}
			os.Exit(1)
		}
		os.Exit(0)
	}

	fmt.Fprintln(os.Stderr, "usage: journal-agent enroll --journal <url> --host <id> < secret | serve | install --manifest <file> --into <dir> | installation --folder <dir>")
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

// printScreen replays a terminal recording through the screen reader and prints the screen it ends on.
func printScreen(folder string) error {
	fixture, err := recording.Load(folder)
	if err != nil {
		return err
	}

	geometry := fixture.StartGeometry()
	reader, err := screen.NewEmulatorReader(int(geometry.Columns), int(geometry.Rows), screen.DefaultLimits, nil)
	if err != nil {
		return err
	}
	if err := fixture.FeedScreen(reader); err != nil {
		return err
	}

	snapshot := reader.Snapshot()
	for _, row := range snapshot.Rows {
		fmt.Println(row)
	}
	fmt.Printf("-- %s, exit %d\n", snapshot.Status(), fixture.ExitCode)

	return nil
}

// settleTime is how long after a key a screen checkpoint is read, so the program has drawn its answer.
const settleTime = 1500 * time.Millisecond

// annotate replays a terminal recording through the screen reader and stores, after each typed input, the screen
// it settled on as a checkpoint of the fixture: the evidence of what each key did.
func annotate(folder string) error {
	fixture, err := recording.Load(folder)
	if err != nil {
		return err
	}

	geometry := fixture.StartGeometry()
	reader, err := screen.NewEmulatorReader(int(geometry.Columns), int(geometry.Rows), screen.DefaultLimits, nil)
	if err != nil {
		return err
	}
	if err := fixture.MarkCheckpoints(reader, settleTime); err != nil {
		return err
	}

	return fixture.Save(folder)
}
