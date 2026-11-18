<?php

declare(strict_types=1);

return [

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
