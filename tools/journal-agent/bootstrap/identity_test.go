package bootstrap

import (
	"errors"
	"strings"
	"testing"
)

const droppedProgramStatus = `Name:	claude
Uid:	10001	10001	10001	10001
Gid:	10001	10001	10001	10001
Groups:	10010
NoNewPrivs:	1
CapInh:	0000000000000000
CapPrm:	0000000000000000
CapEff:	0000000000000000
CapBnd:	0000000000000000
CapAmb:	0000000000000000
`

func TestAProcessDroppedToItsIdentityPassesTheCheck(t *testing.T) {
	if err := ProgramUser.Verify(droppedProgramStatus); err != nil {
		t.Fatal(err)
	}
}

func TestAProcessKeepingAnyPrivilegeFailsTheCheck(t *testing.T) {
	for name, change := range map[string][2]string{
		"a root saved uid":       {"Uid:\t10001\t10001\t10001\t10001", "Uid:\t10001\t10001\t0\t10001"},
		"another group":          {"Gid:\t10001\t10001\t10001\t10001", "Gid:\t10002\t10002\t10002\t10002"},
		"an extra group":         {"Groups:\t10010", "Groups:\t0 10010"},
		"a bounding capability":  {"CapBnd:\t0000000000000000", "CapBnd:\t00000000000000c0"},
		"an effective one":       {"CapEff:\t0000000000000000", "CapEff:\t0000000000000080"},
		"new privileges allowed": {"NoNewPrivs:\t1", "NoNewPrivs:\t0"},
	} {
		status := strings.Replace(droppedProgramStatus, change[0], change[1], 1)

		if err := ProgramUser.Verify(status); !errors.Is(err, ErrIdentityNotDropped) {
			t.Fatalf("%s gave %v", name, err)
		}
	}
}

func TestASupervisorWithNoGroupsPassesWithAnEmptyGroupsLine(t *testing.T) {
	status := strings.NewReplacer("10001", "10003", "Groups:\t10010", "Groups:\t").Replace(droppedProgramStatus)

	if err := SupervisorUser.Verify(status); err != nil {
		t.Fatal(err)
	}
}
