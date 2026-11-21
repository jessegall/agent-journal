<?php

declare(strict_types=1);

use App\Hooks\Events\ContextStarted;
use App\Hooks\Events\HelperCompletionCertified;
use App\Hooks\Events\HelperStopHeld;
use App\Hooks\Events\StateTypesRequested;
use App\Hooks\Events\ToolCallFinished;
use Tests\Architecture\Support\EventRole;

/**
 * The events of Hooks with their role, owning transition and the files that send them today (doc 70, table 1).
 * Each migration slice sets migrated, names a sample, and leaves its owner the one producer; EventProducerTest fails
 * on any producer not listed here.
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
        'role' => EventRole::RowFact,
        'owner' => 'CertifiedWork::record',
        'migrated' => false,
        'producers' => [
            'app/Hooks/Support/StopCertification.php',
        ],
    ],
    HelperStopHeld::class => [
        'role' => EventRole::RowFact,
        'owner' => 'StopAttempt::settle',
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
