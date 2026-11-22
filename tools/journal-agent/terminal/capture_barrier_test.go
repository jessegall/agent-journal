package terminal

import "testing"

func TestCloseIsReadyOnlyWhenEverySinkConfirmed(t *testing.T) {
	barrier := NewCaptureBarrier()
	stopped := map[string]bool{}
	barrier.Register("mirror", CaptureSinkFunc(func() bool { stopped["mirror"] = true; return true }))
	barrier.Register("recorder", CaptureSinkFunc(func() bool { stopped["recorder"] = true; return false }))

	ready := barrier.Close()

	if ready || barrier.IsReady() || !barrier.IsClosed() {
		t.Fatalf("a barrier with an unconfirmed sink answered ready %v", ready)
	}
	if !stopped["mirror"] || !stopped["recorder"] {
		t.Fatalf("not every sink was asked to stop: %v", stopped)
	}
}

func TestASinkThatJoinsAClosedBarrierIsStoppedAtOnce(t *testing.T) {
	barrier := NewCaptureBarrier()
	if !barrier.Close() {
		t.Fatal("an empty barrier was not ready")
	}
	stopped := false

	barrier.Register("late", CaptureSinkFunc(func() bool { stopped = true; return true }))

	if !stopped || !barrier.IsReady() {
		t.Fatal("a sink that joined after the close was not stopped")
	}
}
