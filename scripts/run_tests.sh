#!/bin/sh
# Runs the test ids it is given: a Go test file under a module in tools/ (journal, journal-hook, journal-run) runs its
# package with go test in the workspace of tools/go.work, a viewer test file under src/viewer/tests runs with vitest, anything else runs with pytest.
go_package() {
    echo "./$(dirname "${1%%::*}")"
}
hook_packages=""
client_packages=""
runner_packages=""
python_ids=""
viewer_files=""
for test_id in "$@"; do
    case "$test_id" in
        tools/journal-hook/*) hook_packages="$hook_packages $(go_package "${test_id#tools/journal-hook/}")" ;;
        tools/journal/*) client_packages="$client_packages $(go_package "${test_id#tools/journal/}")" ;;
        tools/journal-run/*) runner_packages="$runner_packages $(go_package "${test_id#tools/journal-run/}")" ;;
        src/viewer/tests/*) viewer_files="$viewer_files ${test_id#src/viewer/}" ;;
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
if [ -n "$runner_packages" ]; then
    (cd tools/journal-run && go test -timeout 300s $runner_packages) || status=1
fi
if [ -n "$viewer_files" ]; then
    npx --prefix src/viewer vitest run --root src/viewer $viewer_files || status=1
fi
exit $status
