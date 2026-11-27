package hostapi

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"net"
	"path/filepath"
	"sync"
	"testing"
	"time"

	"journal-agent/dockermock"
	"journal-agent/host"
)

// sentChunks collects the chunks the host sends for a test to wait on.
type sentChunks struct {
	mutex  sync.Mutex
	chunks []Chunk
}

func (sent *sentChunks) send(_ string, output Output) error {
	sent.mutex.Lock()
	defer sent.mutex.Unlock()
	sent.chunks = append(sent.chunks, output.Chunks...)
	return nil
}

func (sent *sentChunks) textOf(stream string) string {
	sent.mutex.Lock()
	defer sent.mutex.Unlock()
	text := ""
	for _, chunk := range sent.chunks {
		bytes, _ := base64.StdEncoding.DecodeString(chunk.Bytes)
		if chunk.Stream == stream {
			text += string(bytes)
		}
	}
	return text
}

func TestWhatASideSocketTakesArrivesAsChunksOfItsStream(t *testing.T) {
	state := t.TempDir()
	daemon := dockermock.Start(t, mockImage)
	containers, err := host.ContainersOn(daemon.Host(), host.ContainerRules{Arrangement: host.Local})
	if err != nil {
		t.Fatal(err)
	}
	sent := &sentChunks{}
	reports := &sentReports{}
	queue, err := OpenReportQueue(t.TempDir(), reports.send)
	if err != nil {
		t.Fatal(err)
	}
	runQueue(t, queue)
	table := OpenProcessTable(state, containers, queue, NewOutputs(state, sent.send, time.Now))
	t.Cleanup(func() { stopAndWait(daemon, table) })
	plan, err := json.Marshal(OpenPlan{Type: "pipe", Restart: "never", Argv: []string{"sleep", "5"}, Folder: t.TempDir(), SideSockets: []string{"status"}})
	if err != nil {
		t.Fatal(err)
	}

	if _, err := carry(testOrders{ProcessTable: table}, "open_process")(context.Background(), Order{ID: "open-s", Type: "open_process", ProcessID: "s", Payload: string(plan)}); err != nil {
		t.Fatal(err)
	}
	connection, err := net.Dial("unix", filepath.Join(state, "processes", "s", "sockets", "status"))
	if err != nil {
		t.Fatal(err)
	}
	_, _ = connection.Write([]byte(`{"rate_limits":{}}`))
	_ = connection.Close()

	deadline := time.Now().Add(5 * time.Second)
	for sent.textOf("status") != `{"rate_limits":{}}` && time.Now().Before(deadline) {
		time.Sleep(10 * time.Millisecond)
	}
	if text := sent.textOf("status"); text != `{"rate_limits":{}}` {
		t.Fatalf("the side socket's bytes did not arrive as its stream: %q", text)
	}
}
