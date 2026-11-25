<?php

declare(strict_types=1);

use App\Events\Hooks\ContextStarted;
use App\Events\Hooks\HelperCompletionCertified;
use App\Events\Hooks\HelperReportedOnRecord;
use App\Events\Hooks\HelperSentOnRecord;
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
            'app/Support/ContextCollection.php',
        ],
    ],
    HelperCompletionCertified::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Support/StopCertification.php',
        ],
    ],
    HelperSentOnRecord::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Support/HelperRecordFactSender.php',
        ],
    ],
    HelperReportedOnRecord::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Support/HelperRecordFactSender.php',
        ],
    ],
    HelperStopHeld::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Support/StopCheckGate.php',
        ],
    ],
    StateCommandAnswered::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Support/Stack/StateCommandPublisher.php',
        ],
    ],
    StateTypesRequested::class => [
        'role' => EventRole::Request,
        'migrated' => false,
        'producers' => [
            'app/Support/Stack/StateTypes.php',
        ],
    ],
    ToolCallFinished::class => [
        'role' => EventRole::Request,
        'migrated' => false,
        'producers' => [
            'app/Support/FinishedToolCalls.php',
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
