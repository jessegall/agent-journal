package main

import (
	"fmt"
	"os/exec"
	"path/filepath"
	"strconv"
	"strings"
)

func systemSandbox(program string, writable []string, limit readLimit) (shellSandbox, error) {
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
	if limit.Denied != "" {
		fmt.Fprintf(&policy, "(deny file-read-data (subpath %s))", strconv.Quote(limit.Denied))
		for _, folder := range append(append([]string{}, limit.Readable...), writable...) {
			fmt.Fprintf(&policy, "(allow file-read-data (subpath %s))", strconv.Quote(folder))
		}
	}
	return shellSandbox{Level: "macos-sandbox", Program: path, Prefix: []string{"-p", policy.String()}}, nil
}

func sandboxExec(arguments []string) int { return 125 }
