package dockermock

import (
	"strings"
	"testing"

	"github.com/moby/moby/api/types/container"
	"github.com/moby/moby/api/types/mount"
)

// A bind of a folder the daemon's machine does not hold is refused with the daemon's own words; one it holds passes.
func TestABindOfAMissingFolderIsRefused(t *testing.T) {
	daemon := &Daemon{Folders: []string{"/srv/journal/accounts", "/srv/journal/workspaces"}}

	missing := daemon.missingBindSource(container.HostConfig{Mounts: []mount.Mount{
		{Type: mount.TypeBind, Source: "/srv/journal/accounts/01account"},
		{Type: mount.TypeBind, Source: "/srv/journal/sessions"},
	}})
	held := daemon.missingBindSource(container.HostConfig{Mounts: []mount.Mount{
		{Type: mount.TypeBind, Source: "/srv/journal/workspaces/shop"},
	}})
	any := (&Daemon{}).missingBindSource(container.HostConfig{Binds: []string{"/anywhere:/x"}})

	if missing != "/srv/journal/sessions" || held != "" || any != "" || strings.Contains(held, "/") {
		t.Fatalf("missing %q, held %q, any %q", missing, held, any)
	}
}
