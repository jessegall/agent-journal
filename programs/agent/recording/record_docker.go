package recording

import (
	"bytes"
	"io"
	"net/http"
	"sync"
	"time"
)

// RecordDocker passes each call to the daemon and adds it, asked and answered, to the run's docker exchange; what the
// daemon answers goes back unchanged, a refusal with its status too. A streamed answer is kept as it is read, up to
// BodyByteLimit, once its reader closes or ends.
type RecordDocker struct {
	Next     http.RoundTripper
	Recorder Recorder
	Exchange string
}

func (docker RecordDocker) RoundTrip(request *http.Request) (*http.Response, error) {
	_ = docker.Recorder.Add(docker.Exchange, Asked(request, time.Now()))
	response, err := docker.Next.RoundTrip(request)
	if err != nil {
		return response, err
	}
	// An upgraded answer's body is the connection itself, which passes on untouched and is kept only as upgraded.
	if response.StatusCode == http.StatusSwitchingProtocols {
		_ = docker.Recorder.Add(docker.Exchange, Answered(request, response.StatusCode, response.Header, nil, time.Now()))
		return response, nil
	}
	response.Body = &answerKeeper{body: response.Body, done: func(kept []byte) {
		_ = docker.Recorder.Add(docker.Exchange, Answered(request, response.StatusCode, response.Header, kept, time.Now()))
	}}
	return response, nil
}

// UpgradeAsked keeps an attach as it is asked: the client sends it on a connection of its own, which no round
// tripper sees, so the client's request hook hands it here.
func (docker RecordDocker) UpgradeAsked(request *http.Request) error {
	if request.Header.Get("Upgrade") != "" {
		_ = docker.Recorder.Add(docker.Exchange, Asked(request, time.Now()))
	}
	return nil
}

// UpgradeAnswered keeps that an attach was upgraded, never the program's bytes, which the driver exchange holds.
func (docker RecordDocker) UpgradeAnswered(response *http.Response) {
	if response.StatusCode == http.StatusSwitchingProtocols && response.Request != nil {
		_ = docker.Recorder.Add(docker.Exchange, Answered(response.Request, response.StatusCode, response.Header, nil, time.Now()))
	}
}

// answerKeeper passes an answer's body on as the client reads it and keeps its first bytes, handing them over once,
// when the body ends or is closed.
type answerKeeper struct {
	body io.ReadCloser
	kept bytes.Buffer
	once sync.Once
	done func([]byte)
}

func (keeper *answerKeeper) Read(buffer []byte) (int, error) {
	read, err := keeper.body.Read(buffer)
	if room := BodyByteLimit + 1 - keeper.kept.Len(); room > 0 {
		keeper.kept.Write(buffer[:min(read, room)])
	}
	if err == io.EOF {
		keeper.finish()
	}
	return read, err
}

func (keeper *answerKeeper) Close() error {
	keeper.finish()
	return keeper.body.Close()
}

func (keeper *answerKeeper) finish() {
	keeper.once.Do(func() { keeper.done(keeper.kept.Bytes()) })
}
