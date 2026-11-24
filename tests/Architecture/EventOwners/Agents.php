<?php

declare(strict_types=1);

use App\Events\AccountSettingsRequested;
use App\Events\AccountUseChanged;
use App\Events\ActivityRecorded;
use App\Events\AgentHoldReleased;
use App\Events\AgentRuntimeReassigned;
use App\Events\ChildCheckoutRequested;
use App\Events\DriverFailed;
use App\Events\DriverRequestRecovered;
use App\Events\DriverSwitchCancelled;
use App\Events\DriverSwitchConfirmed;
use App\Events\DriverSwitchLaunchFailed;
use App\Events\DriverSwitchPreflighted;
use App\Events\DriverSwitchRefused;
use App\Events\DriverSwitchStartBegun;
use App\Events\DriverSwitchStopBegun;
use App\Events\DriverSwitchStopped;
use App\Events\LaunchCancelled;
use App\Events\LaunchEnded;
use App\Events\MergeOutcomeRecorded;
use App\Events\ProcessStartCancelled;
use App\Events\ProcessStartClaimed;
use App\Events\ProcessStartOutputAdvanced;
use App\Events\ProcessStartRunning;
use App\Events\ProcessStartStopped;
use App\Events\SessionClosed;
use App\Events\SessionOpened;
use App\Events\SessionStateChanged;
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
    ActivityRecorded::class => [
        'role' => EventRole::Projection,
        'migrated' => false,
        'producers' => [
            'app/Support/ServedActivityLog.php',
        ],
    ],
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
    SessionStateChanged::class => [
        'role' => EventRole::Projection,
        'migrated' => false,
        'producers' => [
            'app/Commands/ReconcileStarts/ReconcileStartsHandler.php',
            'app/Commands/ReportRequestProgress/ReportRequestProgressHandler.php',
            'app/Commands/ReportRunning/ReportRunningHandler.php',
            'app/Commands/ReportRuntimeActivity/ReportRuntimeActivityHandler.php',
            'app/Commands/ReportRuntimeExit/ReportRuntimeExitHandler.php',
            'app/Commands/ReportRuntimeHeartbeat/ReportRuntimeHeartbeatHandler.php',
            'app/Commands/ReportStopped/ReportStoppedHandler.php',
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
            'app/Support/HeartbeatService.php',
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
    DriverSwitchPreflighted::class => [
        'role' => EventRole::RowFact,
        'owner' => 'DriverSwitch::markPreflighted',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DriverSwitchPreflighted('switch'),
    ],
    DriverSwitchRefused::class => [
        'role' => EventRole::RowFact,
        'owner' => 'DriverSwitch::refuse',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DriverSwitchRefused('switch', 'the build is missing'),
    ],
    DriverSwitchStopBegun::class => [
        'role' => EventRole::RowFact,
        'owner' => 'DriverSwitch::beginStopping',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DriverSwitchStopBegun('switch'),
    ],
    DriverSwitchStartBegun::class => [
        'role' => EventRole::RowFact,
        'owner' => 'DriverSwitch::beginStarting',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DriverSwitchStartBegun('switch', 'session'),
    ],
    DriverSwitchConfirmed::class => [
        'role' => EventRole::RowFact,
        'owner' => 'DriverSwitch::confirm',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DriverSwitchConfirmed('switch'),
    ],
    DriverSwitchLaunchFailed::class => [
        'role' => EventRole::RowFact,
        'owner' => 'DriverSwitch::failLaunch',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DriverSwitchLaunchFailed('switch', 'the start timed out'),
    ],
    DriverSwitchCancelled::class => [
        'role' => EventRole::RowFact,
        'owner' => 'DriverSwitch::cancel',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DriverSwitchCancelled('switch', null),
    ],
    ProcessStartOutputAdvanced::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ProcessStart::advanceOutputGeneration',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ProcessStartOutputAdvanced('start', 2),
    ],
    ProcessStartRunning::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ProcessStart::recordRunning',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ProcessStartRunning('start', 'execution'),
    ],
    ProcessStartStopped::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ProcessStart::stopWithProof',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ProcessStartStopped('start'),
    ],
    ProcessStartClaimed::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ProcessStart::claim',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ProcessStartClaimed('start'),
    ],
    ProcessStartCancelled::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ProcessStart::cancelPending',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ProcessStartCancelled('start'),
    ],
];
