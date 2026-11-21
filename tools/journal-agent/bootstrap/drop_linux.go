//go:build linux

package bootstrap

import (
	"fmt"
	"os"
	"runtime"
	"strconv"
	"strings"
	"syscall"

	"golang.org/x/sys/unix"
)

// Drop turns the calling process into the identity for good: the supplementary groups, every capability gone from
// the bounding, ambient, inheritable, permitted and effective sets, the group and the user, and no new privileges.
// It runs on one locked thread, so a following exec carries exactly these sets, and checks the result.
func (identity Identity) Drop() error {
	runtime.LockOSThread()
	if err := syscall.Setgroups(identity.Groups); err != nil {
		return fmt.Errorf("setting the groups failed: %w", err)
	}

	last, err := lastCapability()
	if err != nil {
		return err
	}

	for capability := 0; capability <= last; capability++ {
		if err := unix.Prctl(unix.PR_CAPBSET_DROP, uintptr(capability), 0, 0, 0); err != nil {
			return fmt.Errorf("dropping capability %d from the bounding set failed: %w", capability, err)
		}
	}

	if err := unix.Prctl(unix.PR_CAP_AMBIENT, unix.PR_CAP_AMBIENT_CLEAR_ALL, 0, 0, 0); err != nil {
		return fmt.Errorf("clearing the ambient capabilities failed: %w", err)
	}

	if err := syscall.Setresgid(identity.GID, identity.GID, identity.GID); err != nil {
		return fmt.Errorf("setting the group failed: %w", err)
	}

	if err := syscall.Setresuid(identity.UID, identity.UID, identity.UID); err != nil {
		return fmt.Errorf("setting the user failed: %w", err)
	}

	header := unix.CapUserHeader{Version: unix.LINUX_CAPABILITY_VERSION_3}
	empty := [2]unix.CapUserData{}
	if err := unix.Capset(&header, &empty[0]); err != nil {
		return fmt.Errorf("clearing the capability sets failed: %w", err)
	}

	if err := unix.Prctl(unix.PR_SET_NO_NEW_PRIVS, 1, 0, 0, 0); err != nil {
		return fmt.Errorf("setting no new privileges failed: %w", err)
	}

	status, err := os.ReadFile("/proc/thread-self/status")
	if err != nil {
		return fmt.Errorf("reading the process status failed: %w", err)
	}

	return identity.Verify(string(status))
}

// lastCapability is the highest capability number the kernel knows.
func lastCapability() (int, error) {
	text, err := os.ReadFile("/proc/sys/kernel/cap_last_cap")
	if err != nil {
		return 0, fmt.Errorf("reading the last capability failed: %w", err)
	}

	return strconv.Atoi(strings.TrimSpace(string(text)))
}

// closeInherited closes every descriptor above the standard streams.
func closeInherited() error {
	return unix.CloseRange(3, ^uint(0), 0)
}
