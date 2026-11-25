<?php

declare(strict_types=1);

use App\Enums\Drivers\DriverType;
use App\Enums\Drivers\HoldReason;
use App\Enums\Runs\RuntimeActivity;
use App\Enums\Sessions\CleanupState;
use App\Enums\Sessions\StopCheckState;
use App\Events\Sessions\AccountSettingsRequested;
use App\Events\Sessions\AccountUseChanged;
use App\Events\Sessions\ActivityRecorded;
use App\Events\Sessions\AgentDriverTypePreferred;
use App\Events\Sessions\AgentFocusCleared;
use App\Events\Sessions\AgentFocusMoved;
use App\Events\Sessions\AgentHoldReleased;
use App\Events\Sessions\AgentRetired;
use App\Events\Sessions\AgentRuntimeAdopted;
use App\Events\Sessions\AgentRuntimeClosed;
use App\Events\Sessions\AgentRuntimeConfirmedAlive;
use App\Events\Sessions\AgentRuntimeHeld;
use App\Events\Sessions\AgentRuntimeHostChanged;
use App\Events\Sessions\AgentRuntimeObserved;
use App\Events\Sessions\AgentRuntimeReassigned;
use App\Events\Sessions\AgentRuntimeRequestedSettingsRecomputed;
use App\Events\Sessions\AgentRuntimeSettingsObserved;
use App\Events\Sessions\AgentRuntimesFenced;
use App\Events\Sessions\AgentRuntimeStarted;
use App\Events\Sessions\AgentRuntimeStartGrantClaimed;
use App\Events\Sessions\AgentRuntimeStartGrantHeld;
use App\Events\Sessions\AgentRuntimeStopRequested;
use App\Events\Sessions\AgentSessionConversationEntered;
use App\Events\Sessions\AgentSessionDriverLabelKept;
use App\Events\Sessions\AgentSessionEnded;
use App\Events\Sessions\AgentSessionHeartbeatRecorded;
use App\Events\Sessions\AgentSessionSelectionUsed;
use App\Events\Sessions\AgentSessionSkillsGenerated;
use App\Events\Sessions\ChildCheckoutRequested;
use App\Events\Sessions\CleanupPassRecorded;
use App\Events\Sessions\ClosingWordsKeptPrivate;
use App\Events\Sessions\ClosingWordsOffered;
use App\Events\Sessions\DriverBuildsApproved;
use App\Events\Sessions\DriverFailed;
use App\Events\Sessions\DriverRequestAccepted;
use App\Events\Sessions\DriverRequestApplied;
use App\Events\Sessions\DriverRequestAttemptStarted;
use App\Events\Sessions\DriverRequestCancelled;
use App\Events\Sessions\DriverRequestFailed;
use App\Events\Sessions\DriverRequestGivenBack;
use App\Events\Sessions\DriverRequestHeld;
use App\Events\Sessions\DriverRequestMarkedUnavailable;
use App\Events\Sessions\DriverRequestMarkedUncertain;
use App\Events\Sessions\DriverRequestPayloadForgotten;
use App\Events\Sessions\DriverRequestRecovered;
use App\Events\Sessions\DriverRequestRefusalRecorded;
use App\Events\Sessions\DriverRequestResolvedAsNotApplied;
use App\Events\Sessions\DriverRequestRetried;
use App\Events\Sessions\DriverRequestScriptProgressed;
use App\Events\Sessions\DriverRequestStaged;
use App\Events\Sessions\DriverRequestSuperseded;
use App\Events\Sessions\DriverRequestSuspectedDuplicate;
use App\Events\Sessions\DriverRequestWakeAcknowledged;
use App\Events\Sessions\DriverRequestWakeClaimed;
use App\Events\Sessions\DriverSwitchCancelled;
use App\Events\Sessions\DriverSwitchConfirmed;
use App\Events\Sessions\DriverSwitchPreflighted;
use App\Events\Sessions\DriverSwitchRefused;
use App\Events\Sessions\DriverSwitchStartFailed;
use App\Events\Sessions\DriverSwitchStartRequested;
use App\Events\Sessions\DriverSwitchStopped;
use App\Events\Sessions\DriverSwitchStopRequested;
use App\Events\Sessions\DriverTurnFinished;
use App\Events\Sessions\MenuEntryMarkedStale;
use App\Events\Sessions\MenuEntryProven;
use App\Events\Sessions\MenuEntryRetired;
use App\Events\Sessions\MenuEntrySuperseded;
use App\Events\Sessions\MenuEntryUsed;
use App\Events\Sessions\NavigationRequestAbandoned;
use App\Events\Sessions\NavigationRequestAnswered;
use App\Events\Sessions\NavigationRequestCancelled;
use App\Events\Sessions\NavigationRequestExpired;
use App\Events\Sessions\NavigationRequestInterrupted;
use App\Events\Sessions\NavigationRequestProofGiven;
use App\Events\Sessions\NavigationRequestProofRefused;
use App\Events\Sessions\NavigationRequestProven;
use App\Events\Sessions\NavigationRequestSaved;
use App\Events\Sessions\NavigationRequestScreenShown;
use App\Events\Sessions\ProfileRevisionHoldReconciled;
use App\Events\Sessions\SessionClosed;
use App\Events\Sessions\SessionOpened;
use App\Events\Sessions\SessionProcessCancelled;
use App\Events\Sessions\SessionProcessClaimed;
use App\Events\Sessions\SessionProcessOutputAdvanced;
use App\Events\Sessions\SessionProcessSeenRunning;
use App\Events\Sessions\SessionProcessStopped;
use App\Events\Sessions\SessionRequestRefused;
use App\Events\Sessions\SessionStartCancelled;
use App\Events\Sessions\SessionStartEnded;
use App\Events\Sessions\SessionStateChanged;
use App\Events\Sessions\SessionTokenIssued;
use App\Events\Sessions\SessionTokenRevoked;
use App\Events\Sessions\SessionTokenRotated;
use App\Events\Sessions\StartAccepted;
use App\Events\Sessions\StartGrantRequested;
use App\Events\Sessions\StartIdentityBecameUncertain;
use App\Events\Sessions\StartIdentityBound;
use App\Events\Sessions\StartIdentityPrepared;
use App\Events\Sessions\StartIntentForgotten;
use App\Events\Sessions\StartRefused;
use App\Events\Sessions\StartRefusedWithoutAccount;
use App\Events\Sessions\StartSessionOpened;
use App\Events\Sessions\StartSettingsRequested;
use App\Events\Sessions\StartVerificationCancelled;
use App\Events\Sessions\StopCheckCertified;
use App\Events\Sessions\StopCheckSettled;
use App\Events\Sessions\TerminalGrantGivenBack;
use App\Events\Sessions\TerminalGrantIssued;
use App\Events\Sessions\TerminalGrantRefused;
use App\Events\Sessions\TerminalGrantReleased;
use App\Events\Sessions\TerminalGrantRenewed;
use App\Events\Sessions\TerminalGrantRetired;
use App\Events\Sessions\TerminalGrantSequenceTaken;
use App\Events\Sessions\TerminalTakeSent;
use App\Events\Sessions\TerminalViewClosed;
use App\Events\Sessions\TerminalViewFollowed;
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
            'app/Support/ActivityLog.php',
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
            'app/Commands/Agents/ReconcileStarts/ReconcileStartsHandler.php',
            'app/Commands/Drivers/NotifyRequestProgress/NotifyRequestProgressHandler.php',
            'app/Commands/Agents/NotifyRunning/NotifyRunningHandler.php',
            'app/Commands/Drivers/NotifyRuntimeActivity/NotifyRuntimeActivityHandler.php',
            'app/Commands/Agents/NotifyRuntimeExit/NotifyRuntimeExitHandler.php',
            'app/Commands/Agents/NotifyRuntimeHeartbeat/NotifyRuntimeHeartbeatHandler.php',
            'app/Commands/Drivers/NotifyStopped/NotifyStoppedHandler.php',
        ],
    ],
    AccountUseChanged::class => [
        'role' => EventRole::Projection,
        'migrated' => false,
        'producers' => [
            'app/Support/RegisterPendingStart.php',
            'app/Commands/Accounts/CancelAccountUses/CancelAccountUsesHandler.php',
            'app/Commands/Accounts/HoldAccountUses/HoldAccountUsesHandler.php',
            'app/Commands/Agents/ReconcileStarts/ReconcileStartsHandler.php',
            'app/Commands/Agents/NotifyFailure/NotifyFailureHandler.php',
            'app/Commands/Drivers/NotifyStopped/NotifyStoppedHandler.php',
            'app/Commands/Agents/RetireAgent/RetireAgentHandler.php',
            'app/Commands/Accounts/SettleAccountUses/SettleAccountUsesHandler.php',
        ],
    ],
    AgentHoldReleased::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Commands/Sessions/ReleaseAgentHold/ReleaseAgentHoldHandler.php',
        ],
    ],
    AgentRuntimeReassigned::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Commands/Agents/ReassignAgentRuntime/ReassignAgentRuntimeHandler.php',
        ],
    ],
    DriverRequestRecovered::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Support/DriverRequestRecovery.php',
        ],
    ],
    SessionStartCancelled::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Commands/Agents/CancelSessionStart/CancelSessionStartHandler.php',
        ],
    ],
    DriverSwitchStopped::class => [
        'role' => EventRole::RowFact,
        'owner' => 'DriverSwitch::markStopped',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DriverSwitchStopped('switch'),
    ],
    SessionStartEnded::class => [
        'role' => EventRole::Projection,
        'migrated' => false,
        'producers' => [
            'app/Listeners/AnnounceSessionStartEnded.php',
        ],
    ],
    DriverFailed::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Commands/Agents/NotifyFailure/NotifyFailureHandler.php',
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
            'app/Commands/Agents/StartAgent/StartAgentHandler.php',
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
        'owner' => 'SessionProcess::refuse',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new StartRefused('agent', 'session', 'it cannot start here', new DateTimeImmutable('2026-01-01')),
    ],
    StartRefusedWithoutAccount::class => [
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
    DriverSwitchStartFailed::class => [
        'role' => EventRole::RowFact,
        'owner' => 'DriverSwitch::failStart',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DriverSwitchStartFailed('switch', 'the start timed out'),
    ],
    DriverSwitchCancelled::class => [
        'role' => EventRole::RowFact,
        'owner' => 'DriverSwitch::cancel',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DriverSwitchCancelled('switch', null),
    ],
    SessionProcessOutputAdvanced::class => [
        'role' => EventRole::RowFact,
        'owner' => 'SessionProcess::advanceOutputGeneration',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new SessionProcessOutputAdvanced('start', 2),
    ],
    SessionProcessSeenRunning::class => [
        'role' => EventRole::RowFact,
        'owner' => 'SessionProcess::recordRunning',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new SessionProcessSeenRunning('start', 'execution'),
    ],
    SessionProcessStopped::class => [
        'role' => EventRole::RowFact,
        'owner' => 'SessionProcess::stopWithProof',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new SessionProcessStopped('start'),
    ],
    SessionProcessClaimed::class => [
        'role' => EventRole::RowFact,
        'owner' => 'SessionProcess::claim',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new SessionProcessClaimed('start'),
    ],
    SessionProcessCancelled::class => [
        'role' => EventRole::RowFact,
        'owner' => 'SessionProcess::cancelPending',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new SessionProcessCancelled('start'),
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
    AgentFocusCleared::class => [
        'role' => EventRole::RowFact,
        'owner' => 'AgentFocus::clear',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new AgentFocusCleared('agent', 'tasks.task', 'task'),
    ],
    AgentFocusMoved::class => [
        'role' => EventRole::RowFact,
        'owner' => 'AgentFocus::moveTo',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new AgentFocusMoved('agent', 'tasks.task', 'task'),
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
    SessionTokenIssued::class => [
        'role' => EventRole::RowFact,
        'owner' => 'SessionToken::issueFor',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new SessionTokenIssued('token', 'session'),
    ],
    SessionTokenRotated::class => [
        'role' => EventRole::RowFact,
        'owner' => 'SessionToken::rotateTo',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new SessionTokenRotated('token'),
    ],
    SessionTokenRevoked::class => [
        'role' => EventRole::RowFact,
        'owner' => 'SessionToken::revokeAt',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new SessionTokenRevoked('token'),
    ],
    CleanupPassRecorded::class => [
        'role' => EventRole::RowFact,
        'owner' => 'SessionCleanup::recordPass',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new CleanupPassRecorded('cleanup', CleanupState::Pending),
    ],
    ProfileRevisionHoldReconciled::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ProfileRevisionHold::markReconciledAt',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ProfileRevisionHoldReconciled('fence'),
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
        'owner' => 'SessionRequest::prepareIdentity',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new StartIdentityPrepared('start'),
    ],
    StartIdentityBound::class => [
        'role' => EventRole::RowFact,
        'owner' => 'SessionRequest::bindIdentity',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new StartIdentityBound('start', 'native'),
    ],
    StartIdentityBecameUncertain::class => [
        'role' => EventRole::RowFact,
        'owner' => 'SessionRequest::markIdentityUncertain',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new StartIdentityBecameUncertain('start'),
    ],
    StartVerificationCancelled::class => [
        'role' => EventRole::RowFact,
        'owner' => 'SessionRequest::cancelVerification',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new StartVerificationCancelled('start'),
    ],
    StartSessionOpened::class => [
        'role' => EventRole::RowFact,
        'owner' => 'SessionRequest::startedAs',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new StartSessionOpened('start', 'agent', 'session', new RecordIdentity('helpers.helper-job', (string) Str::ulid())),
    ],
    SessionRequestRefused::class => [
        'role' => EventRole::RowFact,
        'owner' => 'SessionRequest::refuseFor',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new SessionRequestRefused('start', 'reason'),
    ],
    StartIntentForgotten::class => [
        'role' => EventRole::RowFact,
        'owner' => 'SessionRequest::forgetIntent',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new StartIntentForgotten('start'),
    ],
    StopCheckSettled::class => [
        'role' => EventRole::RowFact,
        'owner' => 'StopCheck::settle',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new StopCheckSettled('attempt', StopCheckState::cases()[0], 'outcome'),
    ],
    StopCheckCertified::class => [
        'role' => EventRole::RowFact,
        'owner' => 'StopCheck::certify',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new StopCheckCertified('attempt'),
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
    ClosingWordsOffered::class => [
        'role' => EventRole::RowFact,
        'owner' => 'DriverTurn::offerClosingWords',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ClosingWordsOffered('turn'),
    ],
    ClosingWordsKeptPrivate::class => [
        'role' => EventRole::RowFact,
        'owner' => 'DriverTurn::keepClosingWordsPrivate',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ClosingWordsKeptPrivate('turn'),
    ],
    DriverRequestRefusalRecorded::class => [
        'role' => EventRole::RowFact,
        'owner' => 'DriverRequest::recordRefusal',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DriverRequestRefusalRecorded('request'),
    ],
    DriverRequestPayloadForgotten::class => [
        'role' => EventRole::RowFact,
        'owner' => 'DriverRequest::forgetPayload',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DriverRequestPayloadForgotten('request'),
    ],
    DriverRequestResolvedAsNotApplied::class => [
        'role' => EventRole::RowFact,
        'owner' => 'DriverRequest::resolveAsNotApplied',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DriverRequestResolvedAsNotApplied('request'),
    ],
    DriverRequestSuperseded::class => [
        'role' => EventRole::RowFact,
        'owner' => 'DriverRequest::supersede',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DriverRequestSuperseded('request'),
    ],
    DriverRequestCancelled::class => [
        'role' => EventRole::RowFact,
        'owner' => 'DriverRequest::cancel',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DriverRequestCancelled('request'),
    ],
    DriverRequestFailed::class => [
        'role' => EventRole::RowFact,
        'owner' => 'DriverRequest::fail',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DriverRequestFailed('request'),
    ],
    DriverRequestMarkedUnavailable::class => [
        'role' => EventRole::RowFact,
        'owner' => 'DriverRequest::markUnavailable',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DriverRequestMarkedUnavailable('request'),
    ],
    DriverRequestMarkedUncertain::class => [
        'role' => EventRole::RowFact,
        'owner' => 'DriverRequest::markUncertain',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DriverRequestMarkedUncertain('request'),
    ],
    NavigationRequestSaved::class => [
        'role' => EventRole::RowFact,
        'owner' => 'NavigationRequest::savedAs',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new NavigationRequestSaved('request'),
    ],
    NavigationRequestScreenShown::class => [
        'role' => EventRole::RowFact,
        'owner' => 'NavigationRequest::showScreen',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new NavigationRequestScreenShown('request'),
    ],
    NavigationRequestAnswered::class => [
        'role' => EventRole::RowFact,
        'owner' => 'NavigationRequest::answer',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new NavigationRequestAnswered('request'),
    ],
    NavigationRequestProofGiven::class => [
        'role' => EventRole::RowFact,
        'owner' => 'NavigationRequest::prove',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new NavigationRequestProofGiven('request'),
    ],
    NavigationRequestProofRefused::class => [
        'role' => EventRole::RowFact,
        'owner' => 'NavigationRequest::refuseProof',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new NavigationRequestProofRefused('request'),
    ],
    NavigationRequestProven::class => [
        'role' => EventRole::RowFact,
        'owner' => 'NavigationRequest::markProven',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new NavigationRequestProven('request'),
    ],
    NavigationRequestAbandoned::class => [
        'role' => EventRole::RowFact,
        'owner' => 'NavigationRequest::abandon',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new NavigationRequestAbandoned('request'),
    ],
    NavigationRequestInterrupted::class => [
        'role' => EventRole::RowFact,
        'owner' => 'NavigationRequest::interrupt',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new NavigationRequestInterrupted('request'),
    ],
    NavigationRequestCancelled::class => [
        'role' => EventRole::RowFact,
        'owner' => 'NavigationRequest::cancel',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new NavigationRequestCancelled('request'),
    ],
    NavigationRequestExpired::class => [
        'role' => EventRole::RowFact,
        'owner' => 'NavigationRequest::expire',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new NavigationRequestExpired('request'),
    ],
];
