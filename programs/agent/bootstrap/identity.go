// Package bootstrap is the init of a protected-account container: it starts as root with only SETUID, SETGID and
// SETPCAP, starts the executor and the program each under a user of its own with no capabilities left, drops itself
// to a third user and reaps them.
package bootstrap

import (
	"errors"
	"fmt"
	"strconv"
	"strings"
)

// workGroup is the group the program and the executor share for the workspace.
const workGroup = 10010

// Identity is a user, its group and its supplementary groups a process ends up with.
type Identity struct {
	UID    int
	GID    int
	Groups []int
}

var (
	// ExecutorUser runs the commands the model asks for and cannot read the sign-in.
	ExecutorUser = Identity{UID: 10002, GID: 10002, Groups: []int{workGroup}}
	// ProgramUser runs the program and alone reads the sign-in.
	ProgramUser = Identity{UID: 10001, GID: 10001, Groups: []int{workGroup}}
	// SupervisorUser is what the init itself drops to once both children run.
	SupervisorUser = Identity{UID: 10003, GID: 10003}
)

// ErrIdentityNotDropped is a process whose status shows another user, group, capability or privilege than the
// identity it dropped to.
var ErrIdentityNotDropped = errors.New("the process did not drop to its identity")

// capabilityLines are the status lines that must all be zero once an identity is dropped.
var capabilityLines = []string{"CapInh", "CapPrm", "CapEff", "CapBnd", "CapAmb"}

// Verify checks a /proc status text against the identity: every uid and gid field is the identity's, the
// supplementary groups are exactly its groups, every capability set is empty and no new privileges is set.
func (identity Identity) Verify(status string) error {
	fields := statusFields(status)
	uid, gid := strconv.Itoa(identity.UID), strconv.Itoa(identity.GID)
	if !areAllEqual(fields["Uid"], uid) || !areAllEqual(fields["Gid"], gid) {
		return fmt.Errorf("%w: uid %v, gid %v", ErrIdentityNotDropped, fields["Uid"], fields["Gid"])
	}

	if strings.Join(fields["Groups"], " ") != joinedGroups(identity.Groups) {
		return fmt.Errorf("%w: groups %v", ErrIdentityNotDropped, fields["Groups"])
	}

	for _, line := range capabilityLines {
		if len(fields[line]) != 1 || strings.Trim(fields[line][0], "0") != "" {
			return fmt.Errorf("%w: %s %v", ErrIdentityNotDropped, line, fields[line])
		}
	}

	if !areAllEqual(fields["NoNewPrivs"], "1") {
		return fmt.Errorf("%w: no new privileges %v", ErrIdentityNotDropped, fields["NoNewPrivs"])
	}

	return nil
}

// statusFields reads each "Name:\tvalues" line of a status text into its values.
func statusFields(status string) map[string][]string {
	fields := map[string][]string{}
	for _, line := range strings.Split(status, "\n") {
		name, values, found := strings.Cut(line, ":")
		if found {
			fields[name] = strings.Fields(values)
		}
	}

	return fields
}

// areAllEqual is whether there are values and every one is the wanted one.
func areAllEqual(values []string, wanted string) bool {
	if len(values) == 0 {
		return false
	}

	for _, value := range values {
		if value != wanted {
			return false
		}
	}

	return true
}

func joinedGroups(groups []int) string {
	names := make([]string, len(groups))
	for index, group := range groups {
		names[index] = strconv.Itoa(group)
	}

	return strings.Join(names, " ")
}
