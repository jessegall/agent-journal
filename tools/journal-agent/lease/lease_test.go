package lease

import (
	"testing"
	"time"
)

func TestARuntimeThatCannotRenewStopsWithinItsLease(t *testing.T) {
	started := time.Now()
	server := time.Date(2026, 11, 21, 12, 0, 0, 0, time.UTC)
	stopped := false
	supervisor := Supervisor{Stop: func() { stopped = true }}
	supervisor.Renew(Renewed(started, server, server.Add(60*time.Second)))

	if !supervisor.Check(started.Add(59 * time.Second)) {
		t.Fatal("the runtime stopped inside its lease")
	}
	if supervisor.Check(started.Add(61*time.Second)) || !stopped {
		t.Fatal("the runtime kept working past its lease")
	}
}

func TestANeverRenewedRuntimeHasNoLease(t *testing.T) {
	supervisor := Supervisor{Stop: func() {}}

	if supervisor.Check(time.Now()) {
		t.Fatal("a runtime with no renewal may work")
	}
}

func TestTheLeaseCountsFromTheRequestStartNotFromTheAnswer(t *testing.T) {
	started := time.Now()
	server := time.Date(2026, 11, 21, 12, 0, 0, 0, time.UTC)
	lease := Renewed(started, server, server.Add(60*time.Second))

	if !lease.IsExpired(started.Add(60 * time.Second)) {
		t.Fatal("a slow answer lengthened the lease")
	}
}
