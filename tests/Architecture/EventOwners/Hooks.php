<?php

declare(strict_types=1);

use App\Events\ContextStarted;
use App\Events\HelperCompletionCertified;
use App\Events\HelperReportedOnRecord;
use App\Events\HelperSentOnRecord;
use App\Events\HelperStopHeld;
use App\Events\HookCommandAnswered;
use App\Events\StateTypesRequested;
use App\Events\ToolCallFinished;
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
            'app/Support/StopAttemptGate.php',
        ],
    ],
    HookCommandAnswered::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Pipes/Answer/PublishHookEffects.php',
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
];
