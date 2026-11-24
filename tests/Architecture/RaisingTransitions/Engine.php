<?php

declare(strict_types=1);

/**
 * The Engine transitions that raise facts, each called only inside a unit: a command handler, a transaction listener
 * or a model (ModelRaiseCallerTest).
 */
return [
    'AgentStackRow::startFor',
    'AgentStackRow::holdForInvestigation',
    'AgentStackRow::saveFrames',
    'AgentStackRow::closeAt',
    'NumberGroup::takeNumber',
    'NumberGroup::retire',
    'CommandReceipt::complete',
    'CommandReceipt::refuse',
];
