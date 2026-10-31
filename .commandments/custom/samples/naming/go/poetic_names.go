package samples

// Sink takes bytes and keeps nothing.
type Sink struct{}

// @righteous naming_GoPoeticVariableNameDetector
func (Sink) Write(output []byte) (int, error) {
	// @sin naming_GoPoeticVariableNameDetector
	found := len(output)
	// @sin naming_GoPoeticVariableNameDetector
	return found, nil
}
