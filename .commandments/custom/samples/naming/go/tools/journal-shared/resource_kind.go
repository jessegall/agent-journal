package resources

type Kind struct { Name string }

// @righteous naming_go_poetic_variable_name
var Kinds = []Kind{{Name: "doc"}}

// @righteous naming_go_poetic_variable_name
func resourceName(kind Kind) string { return kind.Name }

// @righteous naming_go_poetic_variable_name
type Resource struct { Kind string `json:"kind"` }
