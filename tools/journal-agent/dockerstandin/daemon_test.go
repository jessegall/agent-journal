package dockerstandin

import (
	"bytes"
	"context"
	"net/http"
	"testing"

	"github.com/moby/moby/api/pkg/stdcopy"
	"github.com/moby/moby/api/types/container"
	"github.com/moby/moby/client"
)

const heldImage = "journal/agent@sha256:abc"

// clientOn is Docker's own client talking to the stand-in.
func clientOn(t *testing.T, daemon *Daemon) *client.Client {
	t.Helper()
	docker, err := client.New(client.WithHost(daemon.Host()))
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = docker.Close() })

	return docker
}

// Rule 76: the stand-in answers Docker's own client as a daemon does, through a container's whole life.
func TestDockersOwnClientRunsAContainerToItsEndOnTheStandIn(t *testing.T) {
	daemon := Start(t, heldImage)
	daemon.Programs = func(*Container) Program { return Printing("done\n", 3) }
	docker := clientOn(t, daemon)
	ctx := context.Background()

	created, err := docker.ContainerCreate(ctx, client.ContainerCreateOptions{
		Name:       "one",
		Config:     &container.Config{Image: heldImage, Labels: map[string]string{"journal.session": "s1"}},
		HostConfig: &container.HostConfig{ReadonlyRootfs: true},
	})
	if err != nil {
		t.Fatal(err)
	}
	attached, err := docker.ContainerAttach(ctx, created.ID, client.ContainerAttachOptions{Stream: true, Stdout: true, Stderr: true})
	if err != nil {
		t.Fatal(err)
	}
	defer attached.Close()
	if _, err := docker.ContainerStart(ctx, created.ID, client.ContainerStartOptions{}); err != nil {
		t.Fatal(err)
	}

	var printed bytes.Buffer
	if _, err := stdcopy.StdCopy(&printed, &printed, attached.Reader); err != nil {
		t.Fatal(err)
	}
	waited := docker.ContainerWait(ctx, created.ID, client.ContainerWaitOptions{Condition: container.WaitConditionNotRunning})
	select {
	case result := <-waited.Result:
		if result.StatusCode != 3 || printed.String() != "done\n" {
			t.Fatalf("the program printed %q and ended with %d", printed.String(), result.StatusCode)
		}
	case err := <-waited.Error:
		t.Fatal(err)
	}

	held, found := daemon.Container("one")
	if !found || held.ID != created.ID || !held.HostConfig.ReadonlyRootfs || held.IsRunning() || !held.WasStarted() {
		t.Fatalf("the stand-in holds %+v", held)
	}
	listed, err := docker.ContainerList(ctx, client.ContainerListOptions{
		All: true, Filters: make(client.Filters).Add("label", "journal.session=s1"),
	})
	if err != nil || len(listed.Items) != 1 || listed.Items[0].ID != created.ID {
		t.Fatalf("the container was listed as %+v, %v", listed.Items, err)
	}
	if _, err := docker.ContainerRemove(ctx, created.ID, client.ContainerRemoveOptions{}); err != nil {
		t.Fatal(err)
	}
	if _, kept := daemon.Container("one"); kept || len(daemon.Created()) != 1 {
		t.Fatal("a removed container is still held, or is no longer remembered as created")
	}
}

func TestTheStandInRefusesWhatATestAsksItToAndAnImageItDoesNotHold(t *testing.T) {
	daemon := Start(t, heldImage)
	docker := clientOn(t, daemon)
	ctx := context.Background()

	_, err := docker.ContainerCreate(ctx, client.ContainerCreateOptions{Config: &container.Config{Image: "another"}})
	if err == nil {
		t.Fatal("a container of an image the stand-in does not hold was created")
	}

	daemon.Refuse(http.MethodGet, "/info", http.StatusInternalServerError, "refused-once", 1)
	if _, err := docker.Info(ctx, client.InfoOptions{}); err == nil {
		t.Fatal("a refused request was answered")
	}
	info, err := docker.Info(ctx, client.InfoOptions{})
	if err != nil || info.Info.CgroupDriver != daemon.CgroupDriver {
		t.Fatalf("the request after the refusal gave %+v, %v", info.Info.CgroupDriver, err)
	}
}
