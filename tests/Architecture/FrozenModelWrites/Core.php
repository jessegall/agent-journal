<?php

declare(strict_types=1);

/**
 * The model methods of Core that still write outside their own row, each with the plan 40 phase that moves the write
 * (doc 70, table 2); ModelOwnRowTest fails on a write not listed and on a listed method that writes only its own row.
 * AutoAssignment::markServedAt writes by query, as a save skips an unchanged served time.
 */
return [
    'AutoAssignment::markServedAt' => 9,
    'HasNumber::bootHasNumber' => 9,
];
