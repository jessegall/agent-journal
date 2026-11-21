<?php

declare(strict_types=1);

/**
 * The model methods of Assignments that still write outside their own row, each with the plan 40 phase that moves
 * the write (doc 70, table 2). The list only shrinks: ModelOwnRowTest fails on a write not listed here and on a
 * listed method that writes only its own row.
 */
return [
    'AssignmentRecord::insertUnlessHeld' => 7,
    'AssignmentRecord::releaseClaimsFor' => 7,
    'AutoAssignment::create' => 7,
    'AutoAssignment::markServedAt' => 7,
];
