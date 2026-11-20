package main

import (
	"context"
	"testing"

	"journal-agent/host"
)

func TestAContainedHostDrainsByAccountIdAndALocalOneByFolder(t *testing.T) {
	running := execution{account: "/accounts/7", accountID: "a7"}

	if !running.belongsTo(host.DrainRequest{Account: "/elsewhere", AccountID: "a7"}, host.Contained) {
		t.Fatal("a contained drain by id missed the execution")
	}

	if running.belongsTo(host.DrainRequest{Account: "/accounts/7", AccountID: "a8"}, host.Contained) {
		t.Fatal("a contained drain matched another account by folder")
	}

	if !running.belongsTo(host.DrainRequest{Account: "/accounts/7"}, host.Local) {
		t.Fatal("a local drain by folder missed the execution")
	}
}

func TestAContainedDrainWithoutAnAccountIdIsRefused(t *testing.T) {
	executor := &protectedExecutor{arrangement: host.Contained, codexOwners: &host.CodexOwners{}}

	reply, err := executor.Drain(context.Background(), host.DrainRequest{Account: "/accounts/7"})
	if err != nil || reply.Drained || reply.Reason == "" {
		t.Fatalf("a drain without an id gave %+v, %v", reply, err)
	}
}
