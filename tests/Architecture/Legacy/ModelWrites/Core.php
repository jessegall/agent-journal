<?php

declare(strict_types=1);

/**
 * The model methods of Core that still write outside their own row, each with the plan 40 phase that moves the
 * write (doc 70, table 2). The list only shrinks: ModelOwnRowTest fails on a write not listed here and on a listed
 * method that writes only its own row. AutoAssignment::markServedAt writes by query because a model save skips a
 * served time that is the same.
 */
return [
    'AutoAssignment::markServedAt' => 9,
    'HasNumber::bootHasNumber' => 9,
];
