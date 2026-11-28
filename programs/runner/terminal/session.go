package terminal

import (
	"io"
	"os/exec"
	"sync"
	"time"

	"journal-runner/host"
	"journal-runner/hostapi"
)

// Session runs one program on its own PTY and sends its output to the local display and to its observers.
type Session struct {
	terminal TerminalStream
	command  *exec.Cmd
	group    host.OwnedGroup
	display  io.Writer
	post     func(hostapi.Output) error
	screen   *Screen
	clock    func() time.Time
	started  time.Time
	done     chan struct{}
	exit     hostapi.LocalLinkExit

	writer sync.Mutex
	output sync.Mutex
	stream frameStream
	offset int64
	raw    bool

	privateEntry *time.Timer
	waitForRedraw bool
}

// Start opens the program behind a PTY at the plan's size.
func Start(command *exec.Cmd, plan hostapi.OpenPlan, display io.Writer, post func(hostapi.Output) error) (*Session, error) {
	session, err := newSession(plan, post, time.Now)
	if err != nil {
		return nil, err
	}
	terminal, err := OpenPTY(command, plan.Size)
	if err != nil {
		return nil, err
	}
	session.terminal = terminal
	session.command = command
	session.group = host.OwnedGroupOf(command.Process.Pid)
	session.display = display
	drained := make(chan struct{})
	go func() {
		defer close(drained)
		session.copyOutput()
	}()
	go session.wait(drained, time.Duration(plan.DrainMs)*time.Millisecond)
	return session, nil
}

func newSession(plan hostapi.OpenPlan, post func(hostapi.Output) error, clock func() time.Time) (*Session, error) {
	shown, err := newScreen(int(plan.Size.Columns), int(plan.Size.Rows), plan.ShieldRules)
	if err != nil {
		return nil, err
	}
	return &Session{
		post: post, screen: shown, clock: clock, started: clock(), raw: plan.RawBytes, done: make(chan struct{}),
	}, nil
}

func (session *Session) copyOutput() {
	buffer := make([]byte, 32*1024)
	for {
		count, err := session.terminal.Read(buffer)
		if count > 0 {
			printed := buffer[:count]
			session.printed(printed)
			_, _ = session.display.Write(printed)
		}
		if err != nil {
			return
		}
	}
}

func (session *Session) wait(drained <-chan struct{}, drain time.Duration) {
	defer close(session.done)
	err := session.command.Wait()
	session.exit = hostapi.LocalLinkExit{Code: session.command.ProcessState.ExitCode(), Evidence: "the program exited"}
	if err != nil {
		session.exit.Evidence = err.Error()
	}
	timer := time.NewTimer(drain)
	defer timer.Stop()
	select {
	case <-drained:
	case <-timer.C:
		_ = session.terminal.Close()
		<-drained
	}
	_ = session.terminal.Close()
	_, _ = session.Stream(hostapi.StreamPlan{})
	session.output.Lock()
	defer session.output.Unlock()
	if session.privateEntry != nil {
		session.privateEntry.Stop()
	}
}

func (session *Session) Done() <-chan struct{} {
	return session.done
}

func (session *Session) Wait() hostapi.LocalLinkExit {
	<-session.done
	return session.exit
}

func (session *Session) Size() (hostapi.TerminalSize, error) {
	rows, columns, err := session.terminal.Size()
	return hostapi.TerminalSize{Rows: rows, Columns: columns}, err
}

func (session *Session) Resize(size hostapi.TerminalSize) (hostapi.Empty, error) {
	if size.Rows == 0 || size.Columns == 0 {
		return hostapi.Empty{}, hostapi.RefusalError{Refusal: hostapi.Unsafe, Reason: "the terminal size is empty"}
	}
	session.output.Lock()
	defer session.output.Unlock()
	if err := session.terminal.Resize(size.Rows, size.Columns); err != nil {
		return hostapi.Empty{}, err
	}
	if err := session.screen.reader.Resize(int(size.Columns), int(size.Rows)); err != nil {
		return hostapi.Empty{}, err
	}
	session.screenChanged()
	return hostapi.Empty{}, nil
}

func (session *Session) SpoolOffset() int64 {
	session.output.Lock()
	defer session.output.Unlock()
	return session.offset
}

// Write types the person's keys, invalidating commands guarded by the previous input generation.
func (session *Session) Write(keys []byte) (int, error) {
	session.writer.Lock()
	defer session.writer.Unlock()
	return session.writePerson(keys)
}

func (session *Session) writePerson(keys []byte) (int, error) {
	count, err := session.writeAll(keys)
	if count > 0 {
		session.screen.RaiseInputGeneration()
	}
	return count, err
}

func (session *Session) writeAll(keys []byte) (int, error) {
	written := 0
	for written < len(keys) {
		count, err := session.terminal.Write(keys[written:])
		written += count
		if err != nil {
			return written, err
		}
		if count == 0 {
			return written, io.ErrShortWrite
		}
	}
	return written, nil
}

func (session *Session) WriteKeys(write hostapi.KeyWrite) (hostapi.KeysWritten, error) {
	session.writer.Lock()
	defer session.writer.Unlock()
	if write.AsUser {
		_, err := session.writePerson(write.Bytes)
		return hostapi.KeysWritten{InputGeneration: session.screen.InputGeneration()}, err
	}
	if write.IfRows == nil || write.IfInputGeneration == nil {
		return hostapi.KeysWritten{}, hostapi.RefusalError{
			Refusal: hostapi.Unsafe, Reason: "a key write of the journal names its rows and input generation",
		}
	}
	seen := hostapi.KeysWritten{
		RowHash:         session.screen.RowsHash(write.IfRows.From, write.IfRows.To),
		InputGeneration: session.screen.InputGeneration(),
	}
	if seen.RowHash == "" || seen.RowHash != write.IfRows.Hash || seen.InputGeneration != *write.IfInputGeneration {
		return seen, hostapi.RefusalError{
			Refusal: hostapi.GuardMoved, Reason: "the rows or the input moved since the journal saw them",
		}
	}
	if _, err := session.writeAll(write.Bytes); err != nil {
		return hostapi.KeysWritten{}, err
	}
	return seen, nil
}

func (session *Session) WritePrivate(value []byte) (hostapi.Empty, error) {
	session.writer.Lock()
	defer session.writer.Unlock()
	if !session.isPrivate() {
		return hostapi.Empty{}, hostapi.RefusalError{
			Refusal: hostapi.Unsafe, Reason: "a private value is written only while the entry is private",
		}
	}
	_, err := session.writeAll(value)
	return hostapi.Empty{}, err
}

func (session *Session) OpenPrivate(entry hostapi.PrivateEntry) (hostapi.Empty, error) {
	session.writer.Lock()
	defer session.writer.Unlock()
	session.output.Lock()
	defer session.output.Unlock()
	if session.privateEntry != nil {
		session.privateEntry.Stop()
	}
	var timer *time.Timer
	timer = time.AfterFunc(time.Duration(entry.DeadlineMs)*time.Millisecond, func() {
		session.writer.Lock()
		defer session.writer.Unlock()
		session.output.Lock()
		defer session.output.Unlock()
		if session.privateEntry == timer {
			session.closePrivate()
		}
	})
	session.privateEntry = timer
	session.waitForRedraw = false
	return hostapi.Empty{}, nil
}

func (session *Session) ClosePrivate() (hostapi.Empty, error) {
	session.writer.Lock()
	defer session.writer.Unlock()
	session.output.Lock()
	defer session.output.Unlock()
	session.closePrivate()
	return hostapi.Empty{}, nil
}

func (session *Session) closePrivate() {
	if session.privateEntry != nil {
		session.privateEntry.Stop()
		session.privateEntry = nil
		session.waitForRedraw = true
	}
}

func (session *Session) isPrivate() bool {
	session.output.Lock()
	defer session.output.Unlock()
	return session.privateEntry != nil
}

func (session *Session) monotonic() int64 {
	return session.clock().Sub(session.started).Milliseconds()
}

func (session *Session) printed(printed []byte) {
	session.output.Lock()
	defer session.output.Unlock()
	session.screen.Feed(printed, session.monotonic())
	session.screenChanged()
	wasPrivate := session.privateEntry != nil || session.waitForRedraw
	session.waitForRedraw = false
	if !session.raw || wasPrivate || session.screen.IsShielded() {
		return
	}
	_ = session.post(hostapi.Output{Chunks: hostapi.ChunksOf(hostapi.StandardOutput, session.offset, printed)})
	session.offset += int64(len(printed))
}

// PostSide sends a named stream only while the terminal's output can leave the machine.
func (session *Session) PostSide(stream string, offset int64, printed []byte) error {
	session.output.Lock()
	defer session.output.Unlock()
	if session.privateEntry != nil || session.waitForRedraw || session.screen.IsShielded() {
		return nil
	}
	return session.post(hostapi.Output{Chunks: hostapi.ChunksOf(stream, offset, printed)})
}

// Signal delivers a number to the process group the terminal started.
func (session *Session) Signal(signal hostapi.SignalPlan) (hostapi.Empty, error) {
	return hostapi.Empty{}, hostapi.SignalProcessGroup(session.group, signal.Signal)
}

func (session *Session) Stop(plan hostapi.StopPlan) (hostapi.Empty, error) {
	select {
	case <-session.done:
		return hostapi.Empty{}, nil
	default:
	}
	grace := time.Duration(plan.GraceMs) * time.Millisecond
	force := time.Duration(plan.ForceMs) * time.Millisecond
	deadline := time.Now().Add(grace + force)
	session.group.Stop(host.StopStagesOf(grace, force))
	select {
	case <-session.done:
		return hostapi.Empty{}, nil
	case <-time.After(time.Until(deadline)):
		return hostapi.Empty{}, hostapi.RefusalError{
			Refusal: hostapi.Unsafe, Reason: "the process did not end within its grace and force times",
		}
	}
}
