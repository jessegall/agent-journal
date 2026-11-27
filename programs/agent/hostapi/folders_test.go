package hostapi

import (
	"context"
	"errors"
	"testing"

	"journal-agent/dockermock"
	"journal-agent/host"
)

func folderInstruction(instructionType string) Instruction {
	return Instruction{ID: instructionType, Type: instructionType, Payload: `{"folder":"a7","operation":"operation-1"}`}
}

func TestAHostWithNoDaemonRefusesFolderInstructionsAndBindsNone(t *testing.T) {
	table := OpenProcessTable(t.TempDir(), host.Containers{}, nil, nil)

	_, made := carry(testInstructions{ProcessTable: table}, "make_folder")(context.Background(), folderInstruction("make_folder"))
	_, removed := carry(testInstructions{ProcessTable: table}, "remove_folder")(context.Background(), folderInstruction("remove_folder"))
	use, err := carry(testInstructions{ProcessTable: table}, "folder_use")(context.Background(), folderInstruction("folder_use"))

	var refusal RefusalError
	if !errors.As(made, &refusal) || !errors.As(removed, &refusal) || refusal.Refusal != Unsafe {
		t.Fatalf("a host with no daemon made or removed a folder: %v, %v", made, removed)
	}
	if err != nil || use["is_bound"] != false {
		t.Fatalf("a host with no daemon answered the folder use %v, %v", use, err)
	}
}

func TestAFolderNoContainerBindsIsFree(t *testing.T) {
	table, _ := mockTable(t, dockermock.Start(t, mockImage))

	use, err := carry(testInstructions{ProcessTable: table}, "folder_use")(context.Background(), folderInstruction("folder_use"))

	if err != nil || use["is_bound"] != false {
		t.Fatalf("a folder no container binds answered %v, %v", use, err)
	}
}

func TestFolderInstructionsRunAgainAfterARestart(t *testing.T) {
	for _, instructionType := range []string{"make_folder", "remove_folder", "folder_use"} {
		if !InstructionTypes[instructionType].Repeatable {
			t.Fatalf("%s is not run again after a restart", instructionType)
		}
	}
}
