<?php

declare(strict_types=1);

use App\Events\Hooks\ContextStarted;
use App\Events\Hooks\HelperAssigned;
use App\Events\Hooks\HelperCompletionCertified;
use App\Events\Hooks\HelperFinishedOnRecord;
use App\Events\Hooks\HelperStopHeld;
use App\Events\Hooks\HookCallRecorded;
use App\Events\Hooks\StateCommandAnswered;
use App\Events\Hooks\StateTypesRequested;
use App\Events\Hooks\ToolCallFinished;
use Tests\Architecture\Support\EventRole;

/**
 * The events of Hooks with their role, owning transition or the files that send them.
 * Each row fact names its owning transition and a sample; every other event names the files that send it.
 * EventProducerTest fails on any producer not listed here.
 */
return [
    ContextStarted::class => [
        'role' => EventRole::Request,
        'migrated' => false,
        'producers' => [
            'app/Hooks/ContextCollection.php',
        ],
    ],
    HelperCompletionCertified::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Sessions/StopCertification.php',
        ],
    ],
    HelperAssigned::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Agents/HelperRecordFacts.php',
        ],
    ],
    HelperFinishedOnRecord::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Agents/HelperRecordFacts.php',
        ],
    ],
    HelperStopHeld::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Sessions/Commands/HoldStopCheck/HoldStopCheckHandler.php',
        ],
    ],
    StateCommandAnswered::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Stacks/StateCommandPublisher.php',
        ],
    ],
    StateTypesRequested::class => [
        'role' => EventRole::Request,
        'migrated' => false,
        'producers' => [
            'app/Stacks/StateTypes.php',
        ],
    ],
    ToolCallFinished::class => [
        'role' => EventRole::Request,
        'migrated' => false,
        'producers' => [
            'app/Hooks/FinishedToolCalls.php',
        ],
    ],
    HookCallRecorded::class => [
        'role' => EventRole::RowFact,
        'owner' => 'HookCall::recordFor',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new HookCallRecorded('call'),
    ],
];
