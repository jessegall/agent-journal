package host

// The field numbers of BuildKit's StatusResponse and VertexLog messages (moby/buildkit api/services/control), the only
// parts of a build trace the runner reads.
const (
	statusLogs = 3
	logStream  = 3
	logMessage = 4
)

// protobufValue is one field of a protobuf message: its number, and its value as a varint or as its bytes.
type protobufValue struct {
	number uint64
	varint uint64
	bytes  []byte
}

// protobufField is every length-delimited value of one field of a protobuf message, in order.
func protobufField(message []byte, number uint64) [][]byte {
	values := [][]byte{}
	for _, value := range protobufValues(message) {
		if value.number == number && value.bytes != nil {
			values = append(values, value.bytes)
		}
	}
	return values
}

// protobufNumber is the value of one varint field of a protobuf message, 0 when it holds none.
func protobufNumber(message []byte, number uint64) uint64 {
	for _, value := range protobufValues(message) {
		if value.number == number && value.bytes == nil {
			return value.varint
		}
	}
	return 0
}

// protobufValues are the fields of a protobuf message in order, up to the first that does not read.
func protobufValues(message []byte) []protobufValue {
	values := []protobufValue{}
	for len(message) > 0 {
		key, read := protobufVarint(message)
		if read == 0 {
			return values
		}
		message = message[read:]
		value := protobufValue{number: key >> 3}
		switch key & 7 {
		case 0:
			value.varint, read = protobufVarint(message)
		case 1:
			read = 8
		case 5:
			read = 4
		case 2:
			length, lengthRead := protobufVarint(message)
			if lengthRead == 0 || uint64(len(message)-lengthRead) < length {
				return values
			}
			value.bytes = message[lengthRead : lengthRead+int(length)]
			read = lengthRead + int(length)
		default:
			return values
		}
		if read == 0 || read > len(message) {
			return values
		}
		values = append(values, value)
		message = message[read:]
	}
	return values
}

// protobufVarint is the varint at the start of the bytes and how many bytes it took; 0 bytes when none reads.
func protobufVarint(text []byte) (uint64, int) {
	var value uint64
	for index := 0; index < len(text) && index < 10; index++ {
		value |= uint64(text[index]&0x7f) << (7 * index)
		if text[index] < 0x80 {
			return value, index + 1
		}
	}
	return 0, 0
}
