package samples

import (
    "context"
    "database/sql"
)

// @righteous naming_go_poetic_variable_name
// @righteous naming_go_sentence_variable_name
func standardNames(ctx context.Context, ok bool, err error) (context.Context, bool, error) { return ctx, ok, err }

// @righteous naming_go_poetic_variable_name
func databaseResult(result sql.Result) (int64, error) { return result.LastInsertId() }

func standardCalls() []int {
    // @righteous naming_go_poetic_variable_name
    values := make([]int, 0)
    // @righteous naming_go_sentence_variable_name
    for index := range 2 { values = append(values, index) }
    return values
}

// @sin naming_go_poetic_variable_name
func vagueResult(result string) string { return result }
