<?php

declare(strict_types=1);

/**
 * The model methods of Bus that still write outside their own row, each with the plan 40 phase that moves
 * the write (doc 70, table 2). The list only shrinks: ModelOwnRowTest fails on a write not listed here and on a
 * listed method that writes only its own row.
 */
return [
    'CommandReceipt::expirePastRetention' => 9,
    'CommandReceipt::recordRefusal' => 9,
];
