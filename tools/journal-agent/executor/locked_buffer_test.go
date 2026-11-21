package executor

import (
	"bytes"
	"sync"
)

// lockedBuffer is a buffer the client writes while the test reads it.
type lockedBuffer struct {
	lock   sync.Mutex
	buffer bytes.Buffer
}

func (buffer *lockedBuffer) Write(data []byte) (int, error) {
	buffer.lock.Lock()
	defer buffer.lock.Unlock()

	return buffer.buffer.Write(data)
}

func (buffer *lockedBuffer) String() string {
	buffer.lock.Lock()
	defer buffer.lock.Unlock()

	return buffer.buffer.String()
}
