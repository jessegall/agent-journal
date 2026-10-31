#!/bin/sh
# Runs the test ids it is given: a path under a Go module in tools/ with go test in that module, anything else with pytest.
hook_packages=""
client_packages=""
python_ids=""
for test_id in "$@"; do
    case "$test_id" in
        tools/journal-hook*) hook_packages="$hook_packages ./${test_id#tools/journal-hook/}" ;;
        tools/journal/*) client_packages="$client_packages ./${test_id#tools/journal/}" ;;
        *) python_ids="$python_ids $test_id" ;;
    esac
done
status=0
if [ -n "$python_ids" ]; then
    .venv/bin/python -m pytest -q $python_ids || status=1
fi
if [ -n "$hook_packages" ]; then
    (cd tools/journal-hook && go test -timeout 300s $hook_packages) || status=1
fi
if [ -n "$client_packages" ]; then
    (cd tools/journal && go test -timeout 300s $client_packages) || status=1
fi
exit $status
