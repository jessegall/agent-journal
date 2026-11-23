package host

import (
	"testing"

	"journal-agent/client"
)

func readyReport(generation int) client.RequestReport {
	binding := "thread-1"
	return client.RequestReport{RequestID: "wake", Progress: "applied", ProcessGeneration: generation, ActualBinding: &binding, Sequence: 3}
}

func TestAReadyReportIsKeptAcrossARestartAndAnOlderGenerationNeverReplacesIt(t *testing.T) {
	folder := t.TempDir()
	first := &ReadyObservations{Folder: folder}
	if err := first.Keep("runtime", readyReport(2)); err != nil {
		t.Fatal(err)
	}
	if err := first.Keep("runtime", readyReport(1)); err != nil {
		t.Fatal(err)
	}

	kept, found, err := (&ReadyObservations{Folder: folder}).Of("runtime")

	if err != nil || !found || kept.ProcessGeneration != 2 || kept.Sequence != 3 {
		t.Fatalf("after a restart the kept report was %+v, found %v, %v", kept, found, err)
	}
}

func TestANewerGenerationReplacesTheReadyReportAndAnExitForgetsIt(t *testing.T) {
	observations := &ReadyObservations{Folder: t.TempDir()}
	if err := observations.Keep("runtime", readyReport(1)); err != nil {
		t.Fatal(err)
	}
	if err := observations.Keep("runtime", readyReport(2)); err != nil {
		t.Fatal(err)
	}
	kept, _, _ := observations.Of("runtime")
	if kept.ProcessGeneration != 2 {
		t.Fatalf("the kept report is of generation %d; want 2", kept.ProcessGeneration)
	}

	if err := observations.Forget("runtime"); err != nil {
		t.Fatal(err)
	}

	if _, found, _ := observations.Of("runtime"); found {
		t.Fatal("a forgotten runtime still has a ready report")
	}
}
