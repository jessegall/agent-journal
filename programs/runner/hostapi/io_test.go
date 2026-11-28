package hostapi

import (
	"bytes"
	"encoding/binary"
	"strings"
	"testing"
	"time"

	"journal-runner/recorded"
)

type postedOutputs struct {
	outputs []Output
}

func (posted *postedOutputs) post(_ string, output Output) error {
	posted.outputs = append(posted.outputs, output)
	return nil
}

func TestAPipeReattachesAtItsSpoolOffset(t *testing.T) {
	folder := t.TempDir()
	posted := &postedOutputs{}
	outputs := NewOutputs(folder, posted.post)
	if err := outputs.Open("pipe", OpenPlan{SpoolBytes: 1 << 20, DrainMs: 5000, ExitLogLines: 20, ExitLogBytes: 4096, Type: "pipe"}); err != nil {
		t.Fatal(err)
	}
	probe := recorded.MustProbe(t, "second-version")
	first, second := probe.Output[0].Bytes, probe.Output[1].Bytes
	outputs.Printed("pipe", first)
	outputs.Printed("pipe", second)

	reopened, err := OpenSpool(folder+"/spool/pipe", 1<<20)
	if err != nil {
		t.Fatal(err)
	}
	offset := int64(len(first))
	after, err := reopened.From(offset)
	if err != nil || !bytes.Equal(after, second) || posted.outputs[1].Chunks[0].Offset != offset {
		t.Fatalf("the spool does not resume at its offset: %q, %v", after, err)
	}
}

func TestAContainersLogReachesTheJournalUnderTheNameOfEachStream(t *testing.T) {
	posted := &postedOutputs{}
	outputs := NewOutputs(t.TempDir(), posted.post)
	if err := outputs.Open("pipe", OpenPlan{SpoolBytes: 1 << 20, DrainMs: 5000, ExitLogLines: 20, ExitLogBytes: 4096, Type: "pipe"}); err != nil {
		t.Fatal(err)
	}
	table := &ProcessTable{outputs: outputs}
	version := recorded.MustProbe(t, "version")
	login := recorded.MustProbe(t, "login-status")
	log := bytes.NewReader(append(framed(1, string(version.Output[0].Bytes)), framed(2, string(login.Output[0].Bytes))...))

	table.copyLog("pipe", log, 0)

	if len(posted.outputs) != 2 || posted.outputs[0].Chunks[0].Stream != "stdout" || posted.outputs[1].Chunks[0].Stream != "stderr" {
		t.Fatalf("the journal was sent %+v", posted.outputs)
	}
}

// framed is one piece of a container's log as Docker frames it: the stream, the size, then the bytes.
func framed(stream byte, printed string) []byte {
	header := make([]byte, 8)
	header[0] = stream
	binary.BigEndian.PutUint32(header[4:], uint32(len(printed)))
	return append(header, printed...)
}

func TestAnOutputOverTheLimitIsSplitIntoPosts(t *testing.T) {
	chunks := ChunksOf("stdout", 0, []byte(strings.Repeat("a", OutputLimit)))
	parts := split(Output{Chunks: chunks}, OutputLimit)

	if len(parts) < 2 {
		t.Fatalf("an output of %d chunks was not split: %d posts", len(chunks), len(parts))
	}
}

func TestAPipeHidesPrivateOutputAndResumesAtItsNextOffset(t *testing.T) {
	posted := &postedOutputs{}
	outputs := NewOutputs(t.TempDir(), posted.post)
	if err := outputs.Open("pipe", OpenPlan{SpoolBytes: 1 << 20}); err != nil {
		t.Fatal(err)
	}
	if err := outputs.OpenPrivate("pipe", time.Minute); err != nil {
		t.Fatal(err)
	}
	probe := recorded.MustProbe(t, "second-version")
	outputs.Printed("pipe", probe.Output[0].Bytes)
	outputs.ClosePrivate("pipe")
	outputs.Printed("pipe", probe.Output[1].Bytes)
	if len(posted.outputs) != 1 || posted.outputs[0].Chunks[0].Offset != int64(len(probe.Output[0].Bytes)) {
		t.Fatalf("the pipe sent unexpected output during private entry: %+v", posted.outputs)
	}
}
