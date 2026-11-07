package main

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"runtime"
	"strings"
	"syscall"
	"time"
	"unsafe"
)

const landlockCreate = 444
const landlockAdd = 445
const landlockRestrict = 446
const pathOnly = 0x200000
const noNewPrivileges = 38

func landlockABI() int {
	version, _, err := syscall.Syscall(landlockCreate, 0, 0, 1)
	if err != 0 {
		return 0
	}
	return int(version)
}

func systemSandbox(program string, writable []string, _ readLimit) (shellSandbox, error) {
	if runtime.GOARCH != "amd64" && runtime.GOARCH != "arm64" {
		return shellSandbox{}, fmt.Errorf("read-only shell sandbox needs Linux amd64 or arm64 syscall support")
	}
	encoded, err := json.Marshal(writable)
	if err != nil {
		return shellSandbox{}, err
	}
	abi := landlockABI()
	if abi >= 3 {
		sandbox := linuxSandbox(program, "landlock", encoded)
		if sandboxAvailable(sandbox) {
			return sandbox, nil
		}
	}
	sandbox := linuxSandbox(program, "namespace", encoded)
	if sandboxAvailable(sandbox) {
		return sandbox, nil
	}
	if abi > 0 {
		return linuxSandbox(program, "landlock-partial", encoded), nil
	}
	return shellSandbox{}, fmt.Errorf("read-only shell sandbox unavailable: enable Landlock in the kernel or enable unprivileged user namespaces as root")
}

func sandboxAvailable(sandbox shellSandbox) bool {
	probe := sandbox.command("/bin/true")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	return exec.CommandContext(ctx, probe.Path, probe.Args[1:]...).Run() == nil
}

func linuxSandbox(program, level string, writable []byte) shellSandbox {
	return shellSandbox{Level: level, Program: program, Prefix: []string{"--sandbox-exec", level, string(writable), "--"}}
}

func sandboxExec(arguments []string) int {
	if len(arguments) < 4 || arguments[2] != "--" {
		return 125
	}
	runtime.LockOSThread()
	var writable []string
	if err := json.Unmarshal([]byte(arguments[1]), &writable); err != nil {
		fmt.Fprintln(os.Stderr, err)
		return 125
	}
	var err error
	switch arguments[0] {
	case "landlock", "landlock-partial":
		err = restrictLandlock(writable)
	case "namespace":
		return namespaceCommand(writable, arguments[3:])
	case "mounted":
		err = restrictMounts(writable)
	default:
		return 125
	}
	if err != nil {
		fmt.Fprintln(os.Stderr, "read-only shell sandbox:", err)
		return 125
	}
	path, err := exec.LookPath(arguments[3])
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		return 125
	}
	if err := syscall.Exec(path, arguments[3:], os.Environ()); err != nil {
		fmt.Fprintln(os.Stderr, err)
	}
	return 125
}

func restrictLandlock(writable []string) error {
	abi := landlockABI()
	if abi < 1 {
		return fmt.Errorf("Landlock is not enabled")
	}
	// Only mutation rights are handled; reads, execution and socket connections stay available.
	rights := uint64(1<<1 | 1<<4 | 1<<5 | 1<<6 | 1<<7 | 1<<8 | 1<<9 | 1<<10 | 1<<11 | 1<<12)
	if abi >= 2 {
		rights |= 1 << 13
	}
	if abi >= 3 {
		rights |= 1 << 14
	}
	rules, _, failure := syscall.Syscall(landlockCreate, uintptr(unsafe.Pointer(&rights)), unsafe.Sizeof(rights), 0)
	if failure != 0 {
		return failure
	}
	defer syscall.Close(int(rules))
	for _, path := range append(append([]string{}, writable...), "/dev/null") {
		if err := allowLandlock(rules, rights, path); err != nil {
			return err
		}
	}
	if _, _, err := syscall.Syscall6(syscall.SYS_PRCTL, noNewPrivileges, 1, 0, 0, 0, 0); err != 0 {
		return err
	}
	if _, _, err := syscall.Syscall(landlockRestrict, rules, 0, 0); err != 0 {
		return err
	}
	return nil
}

func allowLandlock(rules uintptr, rights uint64, path string) error {
	fd, err := syscall.Open(path, pathOnly|syscall.O_CLOEXEC, 0)
	if err != nil {
		return err
	}
	defer syscall.Close(fd)
	if path == "/dev/null" {
		rights &= 1<<1 | 1<<14
	}
	rule := struct {
		Rights  uint64
		Parent  int32
		Padding uint32
	}{Rights: rights, Parent: int32(fd)}
	if _, _, failure := syscall.Syscall6(landlockAdd, rules, 1, uintptr(unsafe.Pointer(&rule)), 0, 0, 0); failure != 0 {
		return failure
	}
	return nil
}

func namespaceCommand(writable, arguments []string) int {
	encoded, err := json.Marshal(writable)
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		return 125
	}
	program, err := os.Executable()
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		return 125
	}
	command := exec.Command(program, append([]string{"--sandbox-exec", "mounted", string(encoded), "--"}, arguments...)...)
	command.SysProcAttr = &syscall.SysProcAttr{Cloneflags: syscall.CLONE_NEWUSER | syscall.CLONE_NEWNS,
		UidMappings: []syscall.SysProcIDMap{{ContainerID: 0, HostID: os.Getuid(), Size: 1}},
		GidMappings: []syscall.SysProcIDMap{{ContainerID: 0, HostID: os.Getgid(), Size: 1}}, GidMappingsEnableSetgroups: false}
	command.Stdin, command.Stdout, command.Stderr = os.Stdin, os.Stdout, os.Stderr
	if err := command.Run(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		if exit, ok := err.(*exec.ExitError); ok {
			return exit.ExitCode()
		}
		return 125
	}
	return 0
}

func restrictMounts(writable []string) error {
	if err := syscall.Mount("", "/", "", syscall.MS_REC|syscall.MS_PRIVATE, ""); err != nil {
		return err
	}
	allowed := append(append([]string{}, writable...), "/dev/null")
	for _, folder := range allowed {
		if err := syscall.Mount(folder, folder, "", syscall.MS_BIND, ""); err != nil {
			return err
		}
	}
	contents, err := os.ReadFile("/proc/self/mountinfo")
	if err != nil {
		return err
	}
	lines := strings.Split(strings.TrimSpace(string(contents)), "\n")
	for index := len(lines) - 1; index >= 0; index-- {
		if err := remountReadOnly(lines[index], allowed); err != nil {
			return err
		}
	}
	// A shell must not regain the namespace's mount capabilities through exec as uid zero.
	if _, _, err := syscall.Syscall6(syscall.SYS_PRCTL, 28, 3, 0, 0, 0, 0); err != 0 {
		return err
	}
	if _, _, err := syscall.Syscall6(syscall.SYS_PRCTL, noNewPrivileges, 1, 0, 0, 0, 0); err != 0 {
		return err
	}
	header := struct {
		Version uint32
		Pid     int32
	}{Version: 0x20080522}
	var capabilities [2]struct{ Effective, Permitted, Inheritable uint32 }
	if _, _, err := syscall.Syscall(syscall.SYS_CAPSET, uintptr(unsafe.Pointer(&header)), uintptr(unsafe.Pointer(&capabilities)), 0); err != 0 {
		return err
	}
	return nil
}

func remountReadOnly(line string, writable []string) error {
	fields := strings.Fields(line)
	if len(fields) < 6 {
		return fmt.Errorf("invalid mount table line")
	}
	path := strings.NewReplacer(`\040`, " ", `\011`, "\t", `\012`, "\n", `\134`, `\`).Replace(fields[4])
	for _, folder := range writable {
		if path == folder {
			return nil
		}
	}
	var status syscall.Statfs_t
	if err := syscall.Statfs(path, &status); err != nil {
		return err
	}
	flags := uintptr(status.Flags) & (syscall.MS_NOSUID | syscall.MS_NODEV | syscall.MS_NOEXEC | syscall.MS_NOATIME | syscall.MS_NODIRATIME | syscall.MS_RELATIME)
	flags |= syscall.MS_BIND | syscall.MS_REMOUNT | syscall.MS_RDONLY
	return syscall.Mount("", path, "", flags, "")
}
