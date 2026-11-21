package userservice

import (
	"errors"
	"os"
	"strings"
	"testing"
)

func TestEnableWritesOneServiceAndDisableRemovesTheUnchangedFile(t *testing.T) {
	commands := []string{}
	service := Service{
		Home: t.TempDir(), BindingID: "binding-1", Program: "/installation/bin/journal-agent", StateFolder: "/state",
		Run: func(name string, arguments ...string) error {
			commands = append(commands, name+" "+strings.Join(arguments, " "))
			return nil
		},
	}
	path, _, _, err := service.definition()
	if errors.Is(err, ErrNoServiceManager) {
		t.Skip("this machine has no user service manager")
	}

	if err := service.Enable(); err != nil {
		t.Fatal(err)
	}
	content, err := os.ReadFile(path)
	if err != nil || !strings.Contains(string(content), "relay") || !strings.Contains(string(content), "binding-1") {
		t.Fatalf("the service file holds %s, %v", content, err)
	}
	if err := service.Disable(); err != nil {
		t.Fatal(err)
	}
	if _, err := os.Stat(path); !errors.Is(err, os.ErrNotExist) {
		t.Fatalf("the service file is still there: %v", err)
	}
	if len(commands) < 2 {
		t.Fatalf("the service manager ran %v", commands)
	}
}

func TestAChangedServiceFileIsLeftInPlace(t *testing.T) {
	service := Service{Home: t.TempDir(), BindingID: "binding-1", Program: "/p", StateFolder: "/s",
		Run: func(string, ...string) error { return nil }}
	path, _, _, err := service.definition()
	if errors.Is(err, ErrNoServiceManager) {
		t.Skip("this machine has no user service manager")
	}
	if err := service.Enable(); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(path, []byte("changed by hand"), 0o644); err != nil {
		t.Fatal(err)
	}

	if err := service.Disable(); err == nil {
		t.Fatal("a changed service file was removed")
	}
}
