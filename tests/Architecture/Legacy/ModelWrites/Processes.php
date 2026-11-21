<?php

declare(strict_types=1);

/**
 * The model methods of Processes that still write outside their own row, each with the plan 40 phase that moves
 * the write (doc 70, table 2). The list only shrinks: ModelOwnRowTest fails on a write not listed here and on a
 * listed method that writes only its own row.
 */
return [
    'CommandAlias::record' => 8,
    'ModuleRuleBundle::approve' => 8,
    'ReaderPosition::of' => 8,
    'ReaderPosition::replay' => 8,
    'RuleProposal::record' => 8,
];
