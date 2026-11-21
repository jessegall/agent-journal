<?php

declare(strict_types=1);

use App\Agents\Values\StackTarget;
use Domain\Sequences\Events\SequenceStarted;
use Tests\Architecture\Support\EventRole;

/**
 * The events of Sequences with their role, owning transition and the files that send them today (doc 70, table 1).
 * Each migration slice sets migrated, names a sample, and leaves its owner the one producer; EventProducerTest fails
 * on any producer not listed here.
 */
return [
    SequenceStarted::class => [
        'role' => EventRole::RowFact,
        'owner' => 'SequenceRun::startFor',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new SequenceStarted('run', new StackTarget('agent', 'session')),
    ],
];
