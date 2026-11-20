<?php

declare(strict_types=1);

return [
    'transport_profile' => (string) env('AGENTS_TRANSPORT_PROFILE', 'mcp'),

    /*
    | The protected host's local start socket on this machine (journal-agent's state folder, start.sock): the one
    | way PHP on the host starts or stops a prepared start (doc 57, steps 04 and 24).
    */
    'host_start_socket' => (string) env('AGENTS_HOST_START_SOCKET', ''),

    /*
    | The maintenance key scripts an operator may run on an agent's terminal, by name, each with its version, its
    | parameters and their rules. The host registers exactly these names and versions
    | (tools/journal-agent/keyscripts/scripts, recorded()); nothing else runs (doc 40, section 26).
    */
    'key_scripts' => [
        'ChangeModel' => ['version' => 2, 'parameters' => ['model' => 'required|string|max:200']],
        'ChangeEffort' => ['version' => 1, 'parameters' => ['effort' => 'required|string|max:200']],
    ],

    /*
    | The budgets of the driver ledger: how much one host poll takes and waits, and how large a delivery may be.
    */
    'driver_budgets' => [
        // The most requests one host poll takes, and the longest a poll waits for one (doc 40, sections 10 and 60).
        'claim_batch_max' => (int) env('AGENTS_CLAIM_BATCH_MAX', 20),
        'long_poll_max_seconds' => (int) env('AGENTS_LONG_POLL_MAX_SECONDS', 10),
        // The largest message a delivery carries; a longer one is refused before it is accepted (section 19).
        'deliver_max_bytes' => (int) env('AGENTS_DELIVER_MAX_BYTES', 64 * 1024),
    ],

    /*
    | Navigation requests: how long one waits for the main agent before it expires, and how soon a runtime that
    | waits behind another runtime's open request of the same menu asks again (doc 54, section 5).
    */
    'navigation' => [
        'expire_minutes' => (int) env('AGENTS_NAVIGATION_EXPIRE_MINUTES', 30),
        'retry_after_seconds' => (int) env('AGENTS_NAVIGATION_RETRY_AFTER_SECONDS', 30),
    ],

    /*
    | What this host gives all its helper containers together; each required-container start reserves its budgets
    | from it and is refused when they do not fit. The defaults are one helper's host maxima (doc 14, section 62).
    */
    'host_capacity' => [
        'cpu_cores' => (int) env('AGENTS_HOST_CPU_CORES', 8),
        'memory_bytes' => (int) env('AGENTS_HOST_MEMORY_BYTES', 16 * 1024 * 1024 * 1024),
        'disk_bytes' => (int) env('AGENTS_HOST_DISK_BYTES', 50 * 1024 * 1024 * 1024),
    ],

];
