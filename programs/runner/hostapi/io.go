package hostapi

import (
	"encoding/base64"
	"encoding/json"
	"errors"
	"math"
	"os"
	"path/filepath"
	"sync"
	"time"
)

// OutputLimit is the most bytes the host sends in one output post.
const OutputLimit = 256 * 1024

const adoptedSpoolByteLimit = 1 << 20

// MarshalJSON sends a list the output has none of as an empty list, never as null, as the protocol fixes both.
func (output Output) MarshalJSON() ([]byte, error) {
	type wire Output
	sent := wire(output)
	if sent.Frames == nil {
		sent.Frames = []Frame{}
	}
	if sent.Chunks == nil {
		sent.Chunks = []Chunk{}
	}
	return json.Marshal(sent)
}

// OutputPoster sends a process's output to the journal.
type OutputPoster func(processID string, output Output) error

// Outputs keeps process bytes and posts output to the journal.
type Outputs struct {
	stateFolder string
	post        OutputPoster

	mutex   sync.Mutex
	spools  map[string]*Spool
	private map[string]*time.Timer
}

func NewOutputs(stateFolder string, post OutputPoster) *Outputs {
	return &Outputs{
		stateFolder: stateFolder,
		post:        post,
		spools:      map[string]*Spool{},
		private:     map[string]*time.Timer{},
	}
}

// OpenPrivate holds the pipe's output until the submission closes or its deadline passes.
func (outputs *Outputs) OpenPrivate(processID string, deadline time.Duration) error {
	outputs.mutex.Lock()
	defer outputs.mutex.Unlock()
	if _, opened := outputs.spools[processID]; !opened {
		return RefusalError{Refusal: NotRunning, Reason: "the process has no output"}
	}
	outputs.closePrivate(processID)
	var entry *time.Timer
	entry = time.AfterFunc(deadline, func() {
		outputs.mutex.Lock()
		defer outputs.mutex.Unlock()
		if outputs.private[processID] == entry {
			delete(outputs.private, processID)
		}
	})
	outputs.private[processID] = entry
	return nil
}

func (outputs *Outputs) IsPrivate(processID string) bool {
	outputs.mutex.Lock()
	defer outputs.mutex.Unlock()
	return outputs.private[processID] != nil
}

func (outputs *Outputs) ClosePrivate(processID string) {
	outputs.mutex.Lock()
	defer outputs.mutex.Unlock()
	outputs.closePrivate(processID)
}

func (outputs *Outputs) closePrivate(processID string) {
	if entry := outputs.private[processID]; entry != nil {
		entry.Stop()
		delete(outputs.private, processID)
	}
}

func (outputs *Outputs) Open(processID string, plan OpenPlan) error {
	spool, err := OpenSpool(filepath.Join(outputs.stateFolder, "spool", processID), int64(plan.SpoolBytes))
	if err != nil {
		return err
	}
	outputs.mutex.Lock()
	defer outputs.mutex.Unlock()
	outputs.spools[processID] = spool
	outputs.closePrivate(processID)
	return nil
}

func (outputs *Outputs) openAdopted(processID string) error {
	spool, err := OpenSpool(filepath.Join(outputs.stateFolder, "spool", processID), adoptedSpoolByteLimit)
	if err != nil {
		return err
	}
	outputs.mutex.Lock()
	outputs.spools[processID] = spool
	outputs.mutex.Unlock()
	return nil
}

// acceptAdopted keeps the bytes at the terminal's offsets and forwards its frames as recorded locally.
func (outputs *Outputs) acceptAdopted(processID string, output LocalLinkOutput) error {
	outputs.mutex.Lock()
	spool := outputs.spools[processID]
	outputs.mutex.Unlock()
	for _, chunk := range output.Chunks {
		printed, err := base64.StdEncoding.DecodeString(chunk.Bytes)
		if err != nil {
			return err
		}
		if err := spool.keepAt(chunk.Offset, printed); err != nil {
			return err
		}
	}
	outputs.send(processID, output)
	return nil
}

// Printed takes what the process printed on standard output.
func (outputs *Outputs) Printed(processID string, printed []byte) {
	outputs.PrintedOn(processID, StandardOutput, printed)
}

const (
	StandardOutput = "stdout"
	StandardError  = "stderr"
)

func (outputs *Outputs) PrintedOn(processID string, stream string, printed []byte) {
	outputs.mutex.Lock()
	spool := outputs.spools[processID]
	if spool == nil {
		outputs.mutex.Unlock()
		return
	}
	isPrivate := outputs.private[processID] != nil
	if isPrivate {
		// Count the bytes so a restarted host skips them when it follows the original pipe again.
		printed = make([]byte, len(printed))
	}
	offset, err := spool.Append(printed)
	outputs.mutex.Unlock()
	if err == nil && !isPrivate {
		outputs.send(processID, Output{Chunks: ChunksOf(stream, offset, printed)})
	}
}

// SpoolOffset is the highest byte offset the host has counted for the process.
func (outputs *Outputs) SpoolOffset(processID string) int64 {
	outputs.mutex.Lock()
	spool, found := outputs.spools[processID]
	outputs.mutex.Unlock()
	if !found {
		return 0
	}
	spool.mutex.Lock()
	defer spool.mutex.Unlock()
	return spool.offset
}

// send forwards the relay's output and suppresses posts from a pipe while a private entry is open.
func (outputs *Outputs) send(processID string, output Output) {
	if outputs.IsPrivate(processID) {
		return
	}
	for _, part := range split(output, OutputLimit) {
		_ = outputs.post(processID, part)
	}
}

// split cuts an output into posts whose chunk bytes stay within the limit; frames go in the first post.
func split(output Output, limit int) []Output {
	parts := []Output{{Frames: output.Frames}}
	size := 0
	for _, chunk := range output.Chunks {
		if size+len(chunk.Bytes) > limit && (len(parts[len(parts)-1].Chunks) > 0 || len(parts[len(parts)-1].Frames) > 0) {
			parts = append(parts, Output{})
			size = 0
		}
		last := &parts[len(parts)-1]
		last.Chunks = append(last.Chunks, chunk)
		size += len(chunk.Bytes)
	}
	return parts
}

// ChunksOf cuts bytes into base64 chunks that each fit one post.
func ChunksOf(stream string, offset int64, bytes []byte) []Chunk {
	piece := OutputLimit / 4 * 3
	chunks := []Chunk{}
	for start := 0; start < len(bytes); start += piece {
		end := min(start+piece, len(bytes))
		chunks = append(chunks, Chunk{
			Stream: stream,
			Offset: offset + int64(start),
			Bytes:  base64.StdEncoding.EncodeToString(bytes[start:end]),
		})
	}
	return chunks
}

// Spool keeps a pipe process's output on disk up to the bytes the journal gave it, so a reattach resumes at its
// offset.
type Spool struct {
	path   string
	limit  int64
	mutex  sync.Mutex
	offset int64
}

// OpenSpool opens the spool file, going on at its end, keeping at most the limit.
func OpenSpool(path string, limit int64) (*Spool, error) {
	if err := os.MkdirAll(filepath.Dir(path), 0o700); err != nil {
		return nil, err
	}
	spool := &Spool{path: path, limit: limit}
	if info, err := os.Stat(path); err == nil {
		spool.offset = info.Size()
	}
	return spool, nil
}

// Append adds the bytes and answers the offset they start at; past the limit they are counted, not kept.
func (spool *Spool) Append(bytes []byte) (int64, error) {
	spool.mutex.Lock()
	defer spool.mutex.Unlock()
	start := spool.offset
	spool.offset += int64(len(bytes))
	if start >= spool.limit {
		return start, nil
	}
	file, err := os.OpenFile(spool.path, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0o600)
	if err != nil {
		return start, err
	}
	defer file.Close()
	_, err = file.Write(bytes[:min(len(bytes), int(spool.limit-start))])
	return start, err
}

func (spool *Spool) keepAt(start int64, printed []byte) error {
	if start < 0 || start > math.MaxInt64-int64(len(printed)) {
		return errors.New("the terminal output has an invalid spool offset")
	}
	spool.mutex.Lock()
	defer spool.mutex.Unlock()
	if start < spool.limit && len(printed) > 0 {
		file, err := os.OpenFile(spool.path, os.O_CREATE|os.O_WRONLY, 0o600)
		if err != nil {
			return err
		}
		defer file.Close()
		if _, err := file.WriteAt(printed[:min(len(printed), int(spool.limit-start))], start); err != nil {
			return err
		}
	}
	spool.offset = max(spool.offset, start+int64(len(printed)))
	return nil
}

// From is what the spool kept from the offset on.
func (spool *Spool) From(offset int64) ([]byte, error) {
	spool.mutex.Lock()
	defer spool.mutex.Unlock()
	content, err := os.ReadFile(spool.path)
	if err != nil {
		return nil, err
	}
	if offset >= int64(len(content)) {
		return []byte{}, nil
	}
	return content[offset:], nil
}
