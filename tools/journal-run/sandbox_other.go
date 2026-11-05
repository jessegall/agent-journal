//go:build !darwin && !linux

package main

import "fmt"

func systemSandbox(program string, writable []string, _ readLimit) (shellSandbox, error) {
	return shellSandbox{}, fmt.Errorf("read-only shell sandbox is not available on this operating system")
}

func sandboxExec(arguments []string) int { return 125 }
