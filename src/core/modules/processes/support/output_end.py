# how much of a test run's output its failures are read from: pytest, go test and vitest print every failure and the
# summary naming them at the end, and a megabyte holds thousands of them
FAILURES_END_BYTES = 1024 * 1024
