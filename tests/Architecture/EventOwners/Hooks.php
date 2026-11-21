<?php

declare(strict_types=1);

use App\Hooks\Events\ContextStarted;
use App\Hooks\Events\HelperCompletionCertified;
use App\Hooks\Events\HelperStopHeld;
use App\Hooks\Events\StateTypesRequested;
use App\Hooks\Events\ToolCallFinished;
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
            'app/Hooks/Support/ContextCollection.php',
        ],
    ],
    HelperCompletionCertified::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Hooks/Support/StopCertification.php',
        ],
    ],
    HelperStopHeld::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Hooks/Support/StopAttemptGate.php',
        ],
    ],
    StateTypesRequested::class => [
        'role' => EventRole::Request,
        'migrated' => false,
        'producers' => [
            'app/Hooks/Stack/StateTypes.php',
        ],
    ],
    ToolCallFinished::class => [
        'role' => EventRole::Request,
        'migrated' => false,
        'producers' => [
            'app/Hooks/Support/FinishedToolCalls.php',
        ],
    ],
];
