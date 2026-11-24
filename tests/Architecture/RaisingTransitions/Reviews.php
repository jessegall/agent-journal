<?php

declare(strict_types=1);

/**
 * The Reviews transitions that raise facts, each called only inside a unit: a command handler, a transaction listener
 * or a model (ModelRaiseCallerTest).
 */
return [
    'CodeReview::failImport',
    'CodeReview::open',
    'CodeReview::settle',
    'MergeAttempt::acknowledge',
    'MergeAttempt::resolveByOwner',
    'MergeAttempt::apply',
    'MergeAttempt::merged',
    'MergeAttempt::refuse',
    'MergeAttempt::becomeUncertain',
    'RepairRequest::settle',
    'ReviewDecision::linkMerge',
    'WorkerReservation::occupy',
    'WorkerReservation::release',
    'WorkerReservation::releaseAll',
    'WorkReservation::handOff',
    'WorkReservation::release',
];
