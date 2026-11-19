<?php

declare(strict_types=1);

return [

    /*
    | The maintenance key scripts an operator may run on an agent's terminal, by name, each with its parameters and
    | their rules. The host registers the same names (tools/journal-agent/keyscripts); nothing else runs (doc 40,
    | section 26).
    */
    'key_scripts' => [
        'LoginMcp' => ['version' => 1, 'parameters' => ['server' => 'required|string|max:200']],
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
    | What this host gives all its helper containers together; each required-container launch reserves its budgets
    | from it and is refused when they do not fit. The defaults are one helper's host maxima (doc 14, section 62).
    */
    'host_capacity' => [
        'cpu_cores' => (int) env('AGENTS_HOST_CPU_CORES', 8),
        'memory_bytes' => (int) env('AGENTS_HOST_MEMORY_BYTES', 16 * 1024 * 1024 * 1024),
        'disk_bytes' => (int) env('AGENTS_HOST_DISK_BYTES', 50 * 1024 * 1024 * 1024),
    ],

];
