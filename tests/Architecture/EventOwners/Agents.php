<?php

declare(strict_types=1);

use App\Enums\CleanupState;
use App\Enums\DriverType;
use App\Enums\HoldReason;
use App\Enums\RuntimeActivity;
use App\Enums\StopAttemptState;
use App\Events\AccountSettingsRequested;
use App\Events\AccountUseChanged;
use App\Events\ActivityRecorded;
use App\Events\AgentDriverTypePreferred;
use App\Events\AgentHoldReleased;
use App\Events\AgentRetired;
use App\Events\AgentRuntimeAdopted;
use App\Events\AgentRuntimeClosed;
use App\Events\AgentRuntimeConfirmedAlive;
use App\Events\AgentRuntimeHeld;
use App\Events\AgentRuntimeHostChanged;
use App\Events\AgentRuntimeObserved;
use App\Events\AgentRuntimeReassigned;
use App\Events\AgentRuntimeRequestedSettingsRecomputed;
use App\Events\AgentRuntimeSettingsObserved;
use App\Events\AgentRuntimesFenced;
use App\Events\AgentRuntimeStarted;
use App\Events\AgentRuntimeStartGrantClaimed;
use App\Events\AgentRuntimeStartGrantHeld;
use App\Events\AgentRuntimeStopRequested;
use App\Events\AgentSessionConversationEntered;
use App\Events\AgentSessionDriverLabelKept;
use App\Events\AgentSessionEnded;
use App\Events\AgentSessionHeartbeatRecorded;
use App\Events\AgentSessionSelectionUsed;
use App\Events\AgentSessionSkillsGenerated;
use App\Events\ChildCheckoutRequested;
use App\Events\CleanupPassRecorded;
use App\Events\DriverBuildsApproved;
use App\Events\DriverFailed;
use App\Events\DriverRequestAccepted;
use App\Events\DriverRequestApplied;
use App\Events\DriverRequestAttemptStarted;
use App\Events\DriverRequestGivenBack;
use App\Events\DriverRequestHeld;
use App\Events\DriverRequestRecovered;
use App\Events\DriverRequestRetried;
use App\Events\DriverRequestScriptProgressed;
use App\Events\DriverRequestStaged;
use App\Events\DriverRequestSuspectedDuplicate;
use App\Events\DriverRequestWakeAcknowledged;
use App\Events\DriverRequestWakeClaimed;
use App\Events\DriverSwitchCancelled;
use App\Events\DriverSwitchConfirmed;
use App\Events\DriverSwitchLaunchFailed;
use App\Events\DriverSwitchPreflighted;
use App\Events\DriverSwitchRefused;
use App\Events\DriverSwitchStartRequested;
use App\Events\DriverSwitchStopped;
use App\Events\DriverSwitchStopRequested;
use App\Events\DriverTurnFinished;
use App\Events\LaunchCancelled;
use App\Events\LaunchEnded;
use App\Events\MenuEntryMarkedStale;
use App\Events\MenuEntryProven;
use App\Events\MenuEntryRetired;
use App\Events\MenuEntrySuperseded;
use App\Events\MenuEntryUsed;
use App\Events\MergeOutcomeRecorded;
use App\Events\ProcessStartCancelled;
use App\Events\ProcessStartClaimed;
use App\Events\ProcessStartOutputAdvanced;
use App\Events\ProcessStartSeenRunning;
use App\Events\ProcessStartStopped;
use App\Events\RevisionFenceReconciled;
use App\Events\SessionClosed;
use App\Events\SessionOpened;
use App\Events\SessionStateChanged;
use App\Events\StartAccepted;
use App\Events\StartGrantRequested;
use App\Events\StartIdentityBecameUncertain;
use App\Events\StartIdentityBound;
use App\Events\StartIdentityPrepared;
use App\Events\StartIntentForgotten;
use App\Events\StartRecordRefused;
use App\Events\StartRefused;
use App\Events\StartSessionOpened;
use App\Events\StartSettingsRequested;
use App\Events\StartTokenIssued;
use App\Events\StartTokenRevoked;
use App\Events\StartTokenRotated;
use App\Events\StartUnavailable;
use App\Events\StartVerificationCancelled;
use App\Events\StopAttemptCertified;
use App\Events\StopAttemptSettled;
use App\Events\TerminalGrantGivenBack;
use App\Events\TerminalGrantIssued;
use App\Events\TerminalGrantRefused;
use App\Events\TerminalGrantReleased;
use App\Events\TerminalGrantRenewed;
use App\Events\TerminalGrantRetired;
use App\Events\TerminalGrantSequenceTaken;
use App\Events\TerminalTakeSent;
use App\Events\TerminalViewClosed;
use App\Events\TerminalViewFollowed;
use App\Support\RecordIdentity;
use Illuminate\Support\Str;
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
    DriverSwitchStopRequested::class => [
        'role' => EventRole::RowFact,
        'owner' => 'DriverSwitch::beginStopping',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DriverSwitchStopRequested('switch'),
    ],
    DriverSwitchStartRequested::class => [
        'role' => EventRole::RowFact,
        'owner' => 'DriverSwitch::beginStarting',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DriverSwitchStartRequested('switch', 'session'),
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
    ProcessStartSeenRunning::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ProcessStart::recordRunning',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ProcessStartSeenRunning('start', 'execution'),
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
    AgentDriverTypePreferred::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Agent::preferDriverType',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new AgentDriverTypePreferred('agent', DriverType::Headless),
    ],
    AgentRuntimeAdopted::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Agent::adoptRuntime',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new AgentRuntimeAdopted('agent', 'session', 2),
    ],
    AgentRuntimesFenced::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Agent::fenceRuntimes',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new AgentRuntimesFenced('agent', 2),
    ],
    AgentRetired::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Agent::retireAt',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new AgentRetired('agent'),
    ],
    AgentRuntimeStopRequested::class => [
        'role' => EventRole::RowFact,
        'owner' => 'AgentRuntime::markStopping',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new AgentRuntimeStopRequested('runtime'),
    ],
    AgentRuntimeHeld::class => [
        'role' => EventRole::RowFact,
        'owner' => 'AgentRuntime::holdFor',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new AgentRuntimeHeld('runtime', HoldReason::None),
    ],
    AgentRuntimeClosed::class => [
        'role' => EventRole::RowFact,
        'owner' => 'AgentRuntime::closeAfterExit',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new AgentRuntimeClosed('runtime'),
    ],
    AgentRuntimeStarted::class => [
        'role' => EventRole::RowFact,
        'owner' => 'AgentRuntime::begin',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new AgentRuntimeStarted('runtime'),
    ],
    AgentRuntimeConfirmedAlive::class => [
        'role' => EventRole::RowFact,
        'owner' => 'AgentRuntime::confirmAlive',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new AgentRuntimeConfirmedAlive('runtime'),
    ],
    AgentRuntimeObserved::class => [
        'role' => EventRole::RowFact,
        'owner' => 'AgentRuntime::recordObservation',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new AgentRuntimeObserved('runtime', RuntimeActivity::Starting, 1),
    ],
    AgentRuntimeSettingsObserved::class => [
        'role' => EventRole::RowFact,
        'owner' => 'AgentRuntime::observeSettings',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new AgentRuntimeSettingsObserved('runtime'),
    ],
    AgentRuntimeStartGrantHeld::class => [
        'role' => EventRole::RowFact,
        'owner' => 'AgentRuntime::holdStartGrant',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new AgentRuntimeStartGrantHeld('runtime'),
    ],
    AgentRuntimeStartGrantClaimed::class => [
        'role' => EventRole::RowFact,
        'owner' => 'AgentRuntime::claimStartGrant',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new AgentRuntimeStartGrantClaimed('runtime'),
    ],
    AgentRuntimeRequestedSettingsRecomputed::class => [
        'role' => EventRole::RowFact,
        'owner' => 'AgentRuntime::recomputeRequestedSettings',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new AgentRuntimeRequestedSettingsRecomputed('runtime'),
    ],
    AgentRuntimeHostChanged::class => [
        'role' => EventRole::RowFact,
        'owner' => 'AgentRuntime::reassignTo',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new AgentRuntimeHostChanged('runtime', 'host', 2),
    ],
    StartTokenIssued::class => [
        'role' => EventRole::RowFact,
        'owner' => 'StartToken::issueFor',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new StartTokenIssued('token', 'session'),
    ],
    StartTokenRotated::class => [
        'role' => EventRole::RowFact,
        'owner' => 'StartToken::rotateTo',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new StartTokenRotated('token'),
    ],
    StartTokenRevoked::class => [
        'role' => EventRole::RowFact,
        'owner' => 'StartToken::revokeAt',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new StartTokenRevoked('token'),
    ],
    CleanupPassRecorded::class => [
        'role' => EventRole::RowFact,
        'owner' => 'CleanupOperation::recordPass',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new CleanupPassRecorded('cleanup', CleanupState::Pending),
    ],
    RevisionFenceReconciled::class => [
        'role' => EventRole::RowFact,
        'owner' => 'RevisionFence::markReconciledAt',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new RevisionFenceReconciled('fence'),
    ],
    DriverBuildsApproved::class => [
        'role' => EventRole::RowFact,
        'owner' => 'DriverApproval::approveBuilds',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DriverBuildsApproved('approval'),
    ],
    MenuEntryUsed::class => [
        'role' => EventRole::RowFact,
        'owner' => 'MenuEntry::used',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new MenuEntryUsed('entry'),
    ],
    MenuEntrySuperseded::class => [
        'role' => EventRole::RowFact,
        'owner' => 'MenuEntry::supersededBy',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new MenuEntrySuperseded('entry', 'newer'),
    ],
    MenuEntryRetired::class => [
        'role' => EventRole::RowFact,
        'owner' => 'MenuEntry::retire',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new MenuEntryRetired('entry'),
    ],
    TerminalTakeSent::class => [
        'role' => EventRole::RowFact,
        'owner' => 'TerminalGrant::sendTakeWith',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new TerminalTakeSent('grant', 'request'),
    ],
    TerminalGrantIssued::class => [
        'role' => EventRole::RowFact,
        'owner' => 'TerminalGrant::issue',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new TerminalGrantIssued('grant'),
    ],
    TerminalGrantRefused::class => [
        'role' => EventRole::RowFact,
        'owner' => 'TerminalGrant::refuse',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new TerminalGrantRefused('grant'),
    ],
    TerminalGrantRenewed::class => [
        'role' => EventRole::RowFact,
        'owner' => 'TerminalGrant::renew',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new TerminalGrantRenewed('grant'),
    ],
    TerminalGrantGivenBack::class => [
        'role' => EventRole::RowFact,
        'owner' => 'TerminalGrant::release',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new TerminalGrantGivenBack('grant', 'request'),
    ],
    TerminalGrantReleased::class => [
        'role' => EventRole::RowFact,
        'owner' => 'TerminalGrant::markReleased',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new TerminalGrantReleased('grant'),
    ],
    TerminalGrantRetired::class => [
        'role' => EventRole::RowFact,
        'owner' => 'TerminalGrant::retire',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new TerminalGrantRetired('grant', 'request'),
    ],
    TerminalGrantSequenceTaken::class => [
        'role' => EventRole::RowFact,
        'owner' => 'TerminalGrant::takeSequence',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new TerminalGrantSequenceTaken('grant', 1),
    ],
    TerminalViewFollowed::class => [
        'role' => EventRole::RowFact,
        'owner' => 'TerminalView::follow',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new TerminalViewFollowed('view', 'runtime'),
    ],
    TerminalViewClosed::class => [
        'role' => EventRole::RowFact,
        'owner' => 'TerminalView::close',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new TerminalViewClosed('view'),
    ],
    MenuEntryProven::class => [
        'role' => EventRole::RowFact,
        'owner' => 'MenuEntry::provenOn',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new MenuEntryProven('entry', '2.1.0'),
    ],
    MenuEntryMarkedStale::class => [
        'role' => EventRole::RowFact,
        'owner' => 'MenuEntry::markStaleOn',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new MenuEntryMarkedStale('entry', '2.1.0'),
    ],
    AgentSessionSelectionUsed::class => [
        'role' => EventRole::RowFact,
        'owner' => 'AgentSession::useSelection',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new AgentSessionSelectionUsed('session', 'request'),
    ],
    AgentSessionSkillsGenerated::class => [
        'role' => EventRole::RowFact,
        'owner' => 'AgentSession::recordSkillGeneration',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new AgentSessionSkillsGenerated('session', 'generation'),
    ],
    AgentSessionConversationEntered::class => [
        'role' => EventRole::RowFact,
        'owner' => 'AgentSession::enterConversation',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new AgentSessionConversationEntered('session'),
    ],
    AgentSessionDriverLabelKept::class => [
        'role' => EventRole::RowFact,
        'owner' => 'AgentSession::keepDriverLabel',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new AgentSessionDriverLabelKept('session', 'label'),
    ],
    AgentSessionEnded::class => [
        'role' => EventRole::RowFact,
        'owner' => 'AgentSession::endAt',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new AgentSessionEnded('session'),
    ],
    AgentSessionHeartbeatRecorded::class => [
        'role' => EventRole::RowFact,
        'owner' => 'AgentSession::recordHeartbeatAt',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new AgentSessionHeartbeatRecorded('session'),
    ],
    StartIdentityPrepared::class => [
        'role' => EventRole::RowFact,
        'owner' => 'StartRecord::prepareIdentity',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new StartIdentityPrepared('start'),
    ],
    StartIdentityBound::class => [
        'role' => EventRole::RowFact,
        'owner' => 'StartRecord::bindIdentity',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new StartIdentityBound('start', 'native'),
    ],
    StartIdentityBecameUncertain::class => [
        'role' => EventRole::RowFact,
        'owner' => 'StartRecord::markIdentityUncertain',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new StartIdentityBecameUncertain('start'),
    ],
    StartVerificationCancelled::class => [
        'role' => EventRole::RowFact,
        'owner' => 'StartRecord::cancelVerification',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new StartVerificationCancelled('start'),
    ],
    StartSessionOpened::class => [
        'role' => EventRole::RowFact,
        'owner' => 'StartRecord::startedAs',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new StartSessionOpened('start', 'agent', 'session', new RecordIdentity('helpers.job', (string) Str::ulid())),
    ],
    StartRecordRefused::class => [
        'role' => EventRole::RowFact,
        'owner' => 'StartRecord::refuseFor',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new StartRecordRefused('start', 'reason'),
    ],
    StartIntentForgotten::class => [
        'role' => EventRole::RowFact,
        'owner' => 'StartRecord::forgetIntent',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new StartIntentForgotten('start'),
    ],
    StopAttemptSettled::class => [
        'role' => EventRole::RowFact,
        'owner' => 'StopAttempt::settle',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new StopAttemptSettled('attempt', StopAttemptState::cases()[0], 'outcome'),
    ],
    StopAttemptCertified::class => [
        'role' => EventRole::RowFact,
        'owner' => 'StopAttempt::certify',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new StopAttemptCertified('attempt'),
    ],
    DriverRequestAccepted::class => [
        'role' => EventRole::RowFact,
        'owner' => 'DriverRequest::accept',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DriverRequestAccepted('request'),
    ],
    DriverRequestScriptProgressed::class => [
        'role' => EventRole::RowFact,
        'owner' => 'DriverRequest::recordScriptProgress',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DriverRequestScriptProgressed('request'),
    ],
    DriverRequestGivenBack::class => [
        'role' => EventRole::RowFact,
        'owner' => 'DriverRequest::giveBack',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DriverRequestGivenBack('request'),
    ],
    DriverRequestStaged::class => [
        'role' => EventRole::RowFact,
        'owner' => 'DriverRequest::stage',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DriverRequestStaged('request'),
    ],
    DriverRequestAttemptStarted::class => [
        'role' => EventRole::RowFact,
        'owner' => 'DriverRequest::beginApplying',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DriverRequestAttemptStarted('request', 1),
    ],
    DriverRequestApplied::class => [
        'role' => EventRole::RowFact,
        'owner' => 'DriverRequest::markApplied',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DriverRequestApplied('request'),
    ],
    DriverRequestRetried::class => [
        'role' => EventRole::RowFact,
        'owner' => 'DriverRequest::retry',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DriverRequestRetried('request'),
    ],
    DriverRequestSuspectedDuplicate::class => [
        'role' => EventRole::RowFact,
        'owner' => 'DriverRequest::markPossibleDuplicateOf',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DriverRequestSuspectedDuplicate('request', 'original'),
    ],
    DriverRequestHeld::class => [
        'role' => EventRole::RowFact,
        'owner' => 'DriverRequest::hold',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DriverRequestHeld('request', HoldReason::None),
    ],
    DriverRequestWakeClaimed::class => [
        'role' => EventRole::RowFact,
        'owner' => 'DriverRequest::claimWake',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DriverRequestWakeClaimed('request', 1),
    ],
    DriverRequestWakeAcknowledged::class => [
        'role' => EventRole::RowFact,
        'owner' => 'DriverRequest::acknowledgeWake',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DriverRequestWakeAcknowledged('request', 1),
    ],
    DriverTurnFinished::class => [
        'role' => EventRole::RowFact,
        'owner' => 'DriverTurn::finish',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DriverTurnFinished('turn', 'outcome'),
    ],
];
