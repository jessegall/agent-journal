package launch

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net"
	"os"
	"strings"
	"time"
)

const replacementPoll = 2 * time.Second
const replacementStartLimit = 5 * time.Second

// BinaryVersion identifies an installed executable and the file that supplied it.
type BinaryVersion struct {
	Digest string
	info   os.FileInfo
}

func ReadBinaryVersion(path string) (BinaryVersion, error) {
	file, err := os.Open(path)
	if err != nil {
		return BinaryVersion{}, err
	}
	defer file.Close()
	info, err := file.Stat()
	if err != nil {
		return BinaryVersion{}, err
	}
	digest := sha256.New()
	if _, err := io.Copy(digest, file); err != nil {
		return BinaryVersion{}, err
	}
	return BinaryVersion{hex.EncodeToString(digest.Sum(nil)), info}, nil
}

func socketAnswer(path string, request WorkerRequest) (string, error) {
	connection, err := net.DialTimeout("unix", path, socketDialLimit)
	if err != nil {
		return "", err
	}
	defer connection.Close()
	_ = connection.SetDeadline(time.Now().Add(answerWait + socketDialLimit))
	if err := json.NewEncoder(connection).Encode(request); err != nil {
		return "", err
	}
	answer, err := io.ReadAll(connection)
	return strings.TrimSpace(string(answer)), err
}

// LauncherVersion is the executable served on the public socket, empty for an older protocol.
func LauncherVersion(path string) (string, error) {
	return socketAnswer(path, WorkerRequest{Version: true})
}

// EnsureReplacement waits until the installed executable serves the launcher's socket.
func EnsureReplacement(socket, version string, start func() error) error {
	return ensureReplacement(make(chan struct{}), socket, version, start)
}

func previousAnswer(request WorkerRequest, paths []string) string {
	request.LocalOnly = true
	for _, path := range paths {
		answer, err := socketAnswer(path, request)
		if err == nil && answer != "" {
			return answer
		}
	}
	return ""
}

// HasPrograms keeps an old service alive until all the terminals it routes to have finished.
func (listener *Listener) HasPrograms() bool {
	if listener.inputs.HasPrograms() {
		return true
	}
	for _, path := range listener.previous {
		if answer, err := socketAnswer(path, WorkerRequest{AnyProgram: true, LocalOnly: true}); err == nil && answer != "" {
			return true
		}
		if version, err := LauncherVersion(path); err == nil && version == "" {
			return true
		}
	}
	return false
}

// WatchBinary starts the installed replacement when its contents change, leaving existing terminals with their owner.
func WatchBinary(stop <-chan struct{}, binary, socket string, current BinaryVersion, start func() error, failed func(error)) {
	watchBinary(stop, binary, socket, current, start, failed, replacementPoll)
}

func watchBinary(stop <-chan struct{}, binary, socket string, current BinaryVersion, start func() error, failed func(error), poll time.Duration) {
	ticker := time.NewTicker(poll)
	defer ticker.Stop()
	latest := current
	for {
		select {
		case <-stop:
			return
		case <-ticker.C:
		}
		info, err := os.Stat(binary)
		if err != nil {
			continue
		}
		if !os.SameFile(info, latest.info) || !info.ModTime().Equal(latest.info.ModTime()) || info.Size() != latest.info.Size() {
			changed, err := ReadBinaryVersion(binary)
			if err != nil {
				failed(err)
				continue
			}
			latest = changed
		}
		if latest.Digest == current.Digest {
			continue
		}
		if err := ensureReplacement(stop, socket, latest.Digest, start); err != nil {
			failed(err)
			continue
		}
		return
	}
}

func ensureReplacement(stop <-chan struct{}, socket, version string, start func() error) error {
	if served, err := LauncherVersion(socket); err == nil && served == version {
		return nil
	}
	if err := start(); err != nil {
		return err
	}
	ticker := time.NewTicker(20 * time.Millisecond)
	defer ticker.Stop()
	timeout := time.NewTimer(replacementStartLimit)
	defer timeout.Stop()
	for {
		if served, err := LauncherVersion(socket); err == nil && served == version {
			return nil
		}
		select {
		case <-stop:
			return nil
		case <-timeout.C:
			return fmt.Errorf("the replacement launcher did not take over")
		case <-ticker.C:
		}
	}
}
