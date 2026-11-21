<?php

declare(strict_types=1);

/**
 * The model methods of Supervision that still write outside their own row, each with the plan 40 phase that moves
 * the write (doc 70, table 2). The list only shrinks: ModelOwnRowTest fails on a write not listed here and on a
 * listed method that writes only its own row.
 */
return [
    'Ask::accept' => 9,
    'Ask::submit' => 9,
    'AskHop::recoverEach' => 9,
    'AskRequester::lockSubmissions' => 9,
    'CodeReview::retain' => 9,
    'RepairRequest::retain' => 9,
];
