package main

import (
	"strings"
	"testing"
)

func TestReadOutputAllowance(t *testing.T) {
	for _, check := range []struct {
		name     string
		reads    bool
		bytes    int
		cap      int
		complete bool
	}{
		{"ordinary read", true, 2400, 0, true},
		{"read boundary", true, 16000, 0, true},
		{"large read", true, 16001, 0, false},
		{"other command", false, 2400, 0, false},
		{"explicit cap", true, 2400, 1000, false},
	} {
		t.Run(check.name, func(t *testing.T) {
			text := strings.Repeat("x", check.bytes)
			setup := options(t, "printf '"+text+"'")
			setup.OnlyReads = check.reads
			setup.CapCharacters = check.cap
			output, code := run(t, setup, newClient())
			if code != 0 || (output == text) != check.complete {
				t.Fatalf("code %d, complete %v, expected %v", code, output == text, check.complete)
			}
			if !check.complete && !strings.Contains(output, "journal output read 4 --summary") {
				t.Fatal("capped output did not explain how to read it")
			}
			if stored := readFile(t, folderOf(setup)+"/1.out"); stored != text {
				t.Fatal("the stored output was truncated")
			}
		})
	}
}
