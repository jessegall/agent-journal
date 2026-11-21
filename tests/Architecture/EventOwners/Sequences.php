<?php

declare(strict_types=1);

use App\Agents\Values\StackTarget;
use Domain\Sequences\Events\SequenceStarted;
use Tests\Architecture\Support\EventRole;

/**
 * The events of Sequences with their role, owning transition or the files that send them.
 * Each row fact names its owning transition and a sample; every other event names the files that send it.
 * EventProducerTest fails on any producer not listed here.
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
