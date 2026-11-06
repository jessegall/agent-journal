package launch

import "strings"

type Sample struct{}

func (sample Sample) rows(argv ...string) []string {
	// @sin architecture_launcher_go_oldest_with_a_cap
	return append(argv, "--oldest", "--limit", "1000", "--json")
}

func (sample Sample) newest(argv ...string) []string {
	// @righteous architecture_launcher_go_oldest_with_a_cap
	return append(argv, "--limit", "20", "--json")
}

func (sample Sample) oldestAll(argv ...string) []string {
	// @righteous architecture_launcher_go_oldest_with_a_cap
	return append(argv, "--oldest", "--json")
}

func (sample Sample) hasOpenMain(agents []map[string]string) bool {
	// @sin architecture_launcher_go_agents_listed_in_the_launcher
	rows := sample.rows("agent", "list")
	for _, agent := range agents {
		// @sin architecture_launcher_go_role_compared_in_the_launcher
		if agent["role"] == "main" {
			return len(rows) > 0
		}
	}
	return false
}

func (sample Sample) sameName(name string) bool {
	// @righteous architecture_launcher_go_role_compared_in_the_launcher
	return strings.TrimSpace(name) == "main-branch"
}

func (sample Sample) environments() []string {
	// @righteous architecture_launcher_go_agents_listed_in_the_launcher
	return sample.rows("environment", "list")
}
