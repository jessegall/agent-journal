#!/bin/sh
# Runs the test ids it is given: a path under tools/journal-hook with go test in that Go module, anything else with pytest.
go_packages=""
python_ids=""
for test_id in "$@"; do
    case "$test_id" in
        tools/journal-hook*) go_packages="$go_packages ./${test_id#tools/journal-hook/}" ;;
        *) python_ids="$python_ids $test_id" ;;
    esac
done
status=0
if [ -n "$python_ids" ]; then
    .venv/bin/python -m pytest -q $python_ids || status=1
fi
if [ -n "$go_packages" ]; then
    (cd tools/journal-hook && go test $go_packages) || status=1
fi
exit $status
