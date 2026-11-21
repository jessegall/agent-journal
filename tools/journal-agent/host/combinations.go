package host

import (
	"journal-agent/client"
)

// ProtocolVersion is the version of the protocol this host speaks with the journal; the journal refuses every call of
// a host that speaks another.
const ProtocolVersion = client.HostProtocolVersion
