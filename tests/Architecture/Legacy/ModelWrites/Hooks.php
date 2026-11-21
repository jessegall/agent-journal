<?php

declare(strict_types=1);

/**
 * The model methods of Hooks that still write outside their own row, each with the plan 40 phase that moves
 * the write (doc 70, table 2). The list only shrinks: ModelOwnRowTest fails on a write not listed here and on a
 * listed method that writes only its own row.
 */
return [
    'AgentStackRow::insertIfMissing' => 8,
    'FailureReceipt::receive' => 8,
    'PendingAgentMessage::takeAllFor' => 8,
    'StopAttempt::openFor' => 8,
    'StopResult::forgetOutputBefore' => 8,
];
