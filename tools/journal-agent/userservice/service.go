// Package userservice keeps one binding's relay available with the user's own service manager: one launchd
// StartAgent in the macOS login domain, or one systemd user unit on Linux, run only as that user. There is no
// system-wide daemon and no lingering; without a service manager the binding stays on demand.
package userservice

import (
	"bytes"
	"errors"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strconv"
)

// ErrNoServiceManager is returned on a machine with neither launchd nor a systemd user manager.
var ErrNoServiceManager = errors.New("this machine has no user service manager, so the binding stays on demand: " +
	"its relay starts with the next journal command")

// Service is the user service of one binding's relay.
type Service struct {
	Home        string
	BindingID   string
	Program     string
	StateFolder string
	// Run runs a service manager command; exec by default.
	Run func(name string, arguments ...string) error
}

// Label is the service's name in the service manager.
func (service Service) Label() string { return "nl.journal.relay." + service.BindingID }

// Enable writes the service file and loads it, so the relay starts at login and stays running.
func (service Service) Enable() error {
	path, content, load, err := service.definition()
	if err != nil {
		return err
	}
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		return err
	}
	if err := os.WriteFile(path, content, 0o644); err != nil {
		return err
	}

	return service.run(load[0], load[1:]...)
}

// Disable unloads the service and removes its file only while it is unchanged; then the relay ends after its idle
// window and the binding reads offline.
func (service Service) Disable() error {
	path, content, _, err := service.definition()
	if err != nil {
		return err
	}
	unload := []string{"systemctl", "--user", "disable", "--now", service.Label() + ".service"}
	if runtime.GOOS == "darwin" {
		unload = []string{"launchctl", "bootout", "gui/" + strconv.Itoa(os.Getuid()) + "/" + service.Label()}
	}
	_ = service.run(unload[0], unload[1:]...)

	existing, err := os.ReadFile(path)
	if errors.Is(err, os.ErrNotExist) {
		return nil
	}
	if err != nil {
		return err
	}
	if !bytes.Equal(existing, content) {
		return fmt.Errorf("%s was changed by hand, so it is left in place", path)
	}
	if err := os.Remove(path); err != nil {
		return err
	}
	if runtime.GOOS == "linux" {
		return service.run("systemctl", "--user", "daemon-reload")
	}

	return nil
}

// definition is the service file's path and content and the command that loads it, for this platform.
func (service Service) definition() (string, []byte, []string, error) {
	arguments := []string{service.Program, "relay", "--binding", service.BindingID, "--state", service.StateFolder}
	switch {
	case runtime.GOOS == "darwin" && hasProgram("launchctl"):
		path := filepath.Join(service.Home, "Library", "StartAgents", service.Label()+".plist")
		load := []string{"launchctl", "bootstrap", "gui/" + strconv.Itoa(os.Getuid()), path}
		return path, startAgent(service.Label(), arguments), load, nil
	case runtime.GOOS == "linux" && hasProgram("systemctl"):
		path := filepath.Join(service.Home, ".config", "systemd", "user", service.Label()+".service")
		load := []string{"systemctl", "--user", "enable", "--now", service.Label() + ".service"}
		return path, systemdUnit(arguments), load, nil
	}

	return "", nil, nil, ErrNoServiceManager
}

func (service Service) run(name string, arguments ...string) error {
	if service.Run != nil {
		return service.Run(name, arguments...)
	}

	return exec.Command(name, arguments...).Run()
}

func hasProgram(name string) bool {
	_, err := exec.LookPath(name)

	return err == nil
}

func startAgent(label string, arguments []string) []byte {
	var plist bytes.Buffer
	plist.WriteString(`<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>Label</key>
	<string>` + label + `</string>
	<key>ProgramArguments</key>
	<array>
`)
	for _, argument := range arguments {
		plist.WriteString("\t\t<string>" + argument + "</string>\n")
	}
	plist.WriteString(`	</array>
	<key>RunAtLoad</key>
	<true/>
	<key>KeepAlive</key>
	<true/>
</dict>
</plist>
`)

	return plist.Bytes()
}

func systemdUnit(arguments []string) []byte {
	quoted := make([]string, len(arguments))
	for index, argument := range arguments {
		quoted[index] = strconv.Quote(argument)
	}

	return []byte("[Unit]\nDescription=journal relay\n\n[Service]\nExecStart=" + joinWords(quoted) +
		"\nRestart=always\n\n[Install]\nWantedBy=default.target\n")
}

func joinWords(words []string) string {
	var joined bytes.Buffer
	for index, word := range words {
		if index > 0 {
			joined.WriteString(" ")
		}
		joined.WriteString(word)
	}

	return joined.String()
}
