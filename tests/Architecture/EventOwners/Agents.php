<?php

declare(strict_types=1);

use App\Events\AccountSettingsRequested;
use App\Events\AccountUseChanged;
use App\Events\AgentHoldReleased;
use App\Events\AgentRuntimeReassigned;
use App\Events\ChildCheckoutRequested;
use App\Events\DriverFailed;
use App\Events\DriverRequestRecovered;
use App\Events\DriverSwitchStopped;
use App\Events\LaunchCancelled;
use App\Events\LaunchEnded;
use App\Events\MergeOutcomeRecorded;
use App\Events\SessionClosed;
use App\Events\SessionOpened;
use App\Events\StartAccepted;
use App\Events\StartGrantRequested;
use App\Events\StartRefused;
use App\Events\StartSettingsRequested;
use App\Events\StartUnavailable;
use Tests\Architecture\Support\EventRole;

/**
 * The events of Agents with their role, owning transition or the files that send them.
 * Each row fact names its owning transition and a sample; every other event names the files that send it.
 * EventProducerTest fails on any producer not listed here.
 */
return [
    AccountSettingsRequested::class => [
        'role' => EventRole::Request,
        'migrated' => false,
        'producers' => [
            'app/Support/StartExtensionRequests.php',
        ],
    ],
    ChildCheckoutRequested::class => [
        'role' => EventRole::Request,
        'migrated' => false,
        'producers' => [
            'app/Support/StartExtensionRequests.php',
        ],
    ],
    AccountUseChanged::class => [
        'role' => EventRole::Projection,
        'migrated' => false,
        'producers' => [
            'app/Support/RegisterPendingStart.php',
            'app/Commands/CancelAccountUses/CancelAccountUsesHandler.php',
            'app/Commands/HoldAccountUses/HoldAccountUsesHandler.php',
            'app/Commands/ReconcileStarts/ReconcileStartsHandler.php',
            'app/Commands/ReportFailure/ReportFailureHandler.php',
            'app/Commands/ReportStopped/ReportStoppedHandler.php',
            'app/Commands/RetireAgent/RetireAgentHandler.php',
            'app/Commands/SettleAccountUses/SettleAccountUsesHandler.php',
        ],
    ],
    AgentHoldReleased::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Commands/ReleaseAgentHold/ReleaseAgentHoldHandler.php',
        ],
    ],
    AgentRuntimeReassigned::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Commands/ReassignAgentRuntime/ReassignAgentRuntimeHandler.php',
        ],
    ],
    DriverRequestRecovered::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Support/DriverRequestRecovery.php',
        ],
    ],
    LaunchCancelled::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Commands/CancelLaunch/CancelLaunchHandler.php',
        ],
    ],
    DriverSwitchStopped::class => [
        'role' => EventRole::RowFact,
        'owner' => 'DriverSwitch::markStopped',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DriverSwitchStopped('switch'),
    ],
    LaunchEnded::class => [
        'role' => EventRole::Projection,
        'migrated' => false,
        'producers' => [
            'app/Listeners/AnnounceEndedLaunch.php',
        ],
    ],
    MergeOutcomeRecorded::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Commands/InspectMergeAttempts/InspectMergeAttemptsHandler.php',
            'app/Commands/MergeReviewedWork/MergeReviewedWorkHandler.php',
        ],
    ],
    DriverFailed::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Commands/ReportFailure/ReportFailureHandler.php',
            'app/Support/RecordDriverFailure.php',
        ],
    ],
    SessionClosed::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Support/StartHeartbeats.php',
            'app/Support/StartSessions.php',
        ],
    ],
    SessionOpened::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Support/StartSessions.php',
        ],
    ],
    StartAccepted::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Commands/StartAgent/StartAgentHandler.php',
        ],
    ],
    StartGrantRequested::class => [
        'role' => EventRole::Request,
        'migrated' => false,
        'producers' => [
            'app/Support/StartExtensionRequests.php',
        ],
    ],
    StartSettingsRequested::class => [
        'role' => EventRole::Request,
        'migrated' => false,
        'producers' => [
            'app/Support/StartSessions.php',
        ],
    ],
    StartRefused::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ProcessStart::refuse',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new StartRefused('agent', 'session', 'it cannot start here', new DateTimeImmutable('2026-01-01')),
    ],
    StartUnavailable::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/CommandMiddleware/AnnounceUnavailableStart.php',
        ],
    ],
];
