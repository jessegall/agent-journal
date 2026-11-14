package samples

// Sink takes bytes and keeps nothing.
type Sink struct{}

// @righteous naming_go_poetic_variable_name
func (Sink) Write(output []byte) (int, error) {
	// @sin naming_go_poetic_variable_name
	found := len(output)
	// @sin naming_go_poetic_variable_name
	return found, nil
}
