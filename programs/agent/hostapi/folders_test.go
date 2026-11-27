package hostapi

import (
	"context"
	"errors"
	"testing"

	"journal-agent/dockermock"
	"journal-agent/host"
)

func folderOrder(orderType string) Order {
	return Order{ID: orderType, Type: orderType, Payload: `{"folder":"a7","operation":"operation-1"}`}
}

func TestAHostWithNoDaemonRefusesFolderOrdersAndBindsNone(t *testing.T) {
	table := OpenProcessTable(t.TempDir(), host.Containers{}, nil, nil)

	_, made := carry(testOrders{ProcessTable: table}, "make_folder")(context.Background(), folderOrder("make_folder"))
	_, removed := carry(testOrders{ProcessTable: table}, "remove_folder")(context.Background(), folderOrder("remove_folder"))
	use, err := carry(testOrders{ProcessTable: table}, "folder_use")(context.Background(), folderOrder("folder_use"))

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

	use, err := carry(testOrders{ProcessTable: table}, "folder_use")(context.Background(), folderOrder("folder_use"))

	if err != nil || use["is_bound"] != false {
		t.Fatalf("a folder no container binds answered %v, %v", use, err)
	}
}

func TestFolderOrdersRunAgainAfterARestart(t *testing.T) {
	for _, orderType := range []string{"make_folder", "remove_folder", "folder_use"} {
		if !OrderTypes[orderType].Repeatable {
			t.Fatalf("%s is not run again after a restart", orderType)
		}
	}
}
