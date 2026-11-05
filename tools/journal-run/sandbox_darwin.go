package main

import (
	"fmt"
	"os/exec"
	"path/filepath"
	"strconv"
	"strings"
)

func systemSandbox(program string, writable []string) (shellSandbox, error) {
	path, err := exec.LookPath("sandbox-exec")
	if err != nil {
		return shellSandbox{}, fmt.Errorf("read-only shell sandbox needs macOS sandbox-exec: %w", err)
	}
	var policy strings.Builder
	policy.WriteString("(version 1)(allow default)(deny file-write*)(allow file-write* (literal \"/dev/null\"))")
	for _, folder := range writable {
		resolved, err := filepath.EvalSymlinks(folder)
		if err != nil {
			return shellSandbox{}, err
		}
		fmt.Fprintf(&policy, "(allow file-write* (subpath %s))", strconv.Quote(resolved))
	}
	return shellSandbox{Level: "macos-sandbox", Program: path, Prefix: []string{"-p", policy.String()}}, nil
}

func sandboxExec(arguments []string) int { return 125 }
