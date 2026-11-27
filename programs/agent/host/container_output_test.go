package host

import (
	"bytes"
	"encoding/binary"
	"errors"
	"io"
	"testing"
)

func framedPiece(stream byte, printed string) []byte {
	header := make([]byte, 8)
	header[0] = stream
	binary.BigEndian.PutUint32(header[4:], uint32(len(printed)))
	return append(header, printed...)
}

func TestEachPieceOfAContainersLogKeepsTheStreamItWasPrintedOn(t *testing.T) {
	log := bytes.NewReader(append(framedPiece(1, "build 1.2.3\n"), framedPiece(2, "signed in\n")...))

	first, _ := NextPrinted(log)
	second, _ := NextPrinted(log)
	_, ended := NextPrinted(log)

	if string(first.Bytes) != "build 1.2.3\n" || first.IsError || string(second.Bytes) != "signed in\n" ||
		!second.IsError || !errors.Is(ended, io.EOF) {
		t.Fatalf("the log read as %+v, %+v, then %v", first, second, ended)
	}
}
