<?php

declare(strict_types=1);

use App\Agents\Events\AccountSettingsRequested;
use App\Agents\Events\AccountUseChanged;
use App\Agents\Events\AgentHoldReleased;
use App\Agents\Events\AgentRuntimeReassigned;
use App\Agents\Events\DriverRequestRecovered;
use App\Agents\Events\LaunchCancelled;
use App\Agents\Events\LaunchEnded;
use App\Agents\Events\MergeOutcomeRecorded;
use App\Agents\Events\ProgramFailed;
use App\Agents\Events\SessionClosed;
use App\Agents\Events\SessionOpened;
use App\Agents\Events\StartAccepted;
use App\Agents\Events\StartGrantRequested;
use App\Agents\Events\StartSettingsRequested;
use App\Agents\Events\StartUnavailable;
use Tests\Architecture\Support\EventRole;

/**
 * The events of Agents with their role, owning transition and the files that send them today (doc 70, table 1).
 * Each migration slice sets migrated, names a sample, and leaves its owner the one producer; EventProducerTest fails
 * on any producer not listed here.
 */
return [
    AccountSettingsRequested::class => [
        'role' => EventRole::Request,
        'migrated' => false,
        'producers' => [
            'app/Agents/Handlers/ClaimStartHandler.php',
        ],
    ],
    AccountUseChanged::class => [
        'role' => EventRole::Projection,
        'migrated' => false,
        'producers' => [
            'app/Agents/Actions/RegisterPendingStart.php',
            'app/Agents/Handlers/CancelAccountUsesHandler.php',
            'app/Agents/Handlers/HoldAccountUsesHandler.php',
            'app/Agents/Handlers/ReconcileStartsHandler.php',
            'app/Agents/Handlers/ReportFailureHandler.php',
            'app/Agents/Handlers/ReportStoppedHandler.php',
            'app/Agents/Handlers/RetireAgentHandler.php',
            'app/Agents/Handlers/SettleAccountUsesHandler.php',
        ],
    ],
    AgentHoldReleased::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Agents/Handlers/ReleaseAgentHoldHandler.php',
        ],
    ],
    AgentRuntimeReassigned::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Agents/Handlers/ReassignAgentRuntimeHandler.php',
        ],
    ],
    DriverRequestRecovered::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Agents/Support/DriverRequestRecovery.php',
        ],
    ],
    LaunchCancelled::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Agents/Handlers/CancelLaunchHandler.php',
        ],
    ],
    LaunchEnded::class => [
        'role' => EventRole::Projection,
        'migrated' => false,
        'producers' => [
            'app/Agents/Listeners/AnnounceEndedLaunch.php',
        ],
    ],
    MergeOutcomeRecorded::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Agents/Handlers/InspectMergeAttemptsHandler.php',
            'app/Agents/Handlers/MergeReviewedWorkHandler.php',
        ],
    ],
    ProgramFailed::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Agents/Handlers/ReportFailureHandler.php',
            'app/Hooks/Actions/RecordProgramFailure.php',
        ],
    ],
    SessionClosed::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Agents/Actions/StartHeartbeats.php',
            'app/Agents/Actions/StartSessions.php',
        ],
    ],
    SessionOpened::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Agents/Actions/StartSessions.php',
        ],
    ],
    StartAccepted::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Agents/Handlers/StartAgentHandler.php',
        ],
    ],
    StartGrantRequested::class => [
        'role' => EventRole::Request,
        'migrated' => false,
        'producers' => [
            'app/Agents/Handlers/ClaimStartGrantHandler.php',
        ],
    ],
    StartSettingsRequested::class => [
        'role' => EventRole::Request,
        'migrated' => false,
        'producers' => [
            'app/Agents/Actions/StartSessions.php',
        ],
    ],
    StartUnavailable::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Agents/CommandMiddleware/AnnounceUnavailableStart.php',
        ],
    ],
];
