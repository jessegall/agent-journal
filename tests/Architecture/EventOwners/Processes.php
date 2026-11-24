<?php

declare(strict_types=1);

use App\Enums\ActorType;
use App\Enums\CaptureState;
use App\Enums\RunLogicalResult;
use App\Events\BundleActivated;
use App\Events\ClassificationRuleRetired;
use App\Events\EvidenceFoundInvalid;
use App\Events\EvidencePermitConsumed;
use App\Events\EvidencePermitExpired;
use App\Events\OutputChunkCommitted;
use App\Events\PartRunCaptured;
use App\Events\PartRunCaptureMarked;
use App\Events\PartRunDrained;
use App\Events\PartRunLost;
use App\Events\PartRunProcessFinished;
use App\Events\PartRunSkipped;
use App\Events\PartRunSpawnFailed;
use App\Events\PartRunStarted;
use App\Events\PartRunStopped;
use App\Events\ProcessRunConsumed;
use App\Events\ProcessRunLost;
use App\Events\ProcessRunMarkedStale;
use App\Events\ProcessRunOutcomeUserRevoked;
use App\Events\ProcessRunOutlasted;
use App\Events\ProcessRunStopped;
use App\Events\ProcessRunUpdateCounted;
use App\Events\ReaderPositionAdvanced;
use App\Events\ReaderPositionFailed;
use App\Events\ReaderPositionRewound;
use App\Events\ResultReceiptSuperseded;
use App\Events\RuleActivated;
use App\Events\RuleProposalAdopted;
use App\Events\RuleProposalWithdrawn;
use App\Events\RuleRejected;
use App\Events\RuleRetired;
use App\Events\RunChanged;
use App\Events\RunOutcomeRecorded;
use App\Support\ActorIdentity;
use Tests\Architecture\Support\EventRole;

/**
 * The events of Processes with their role, owning transition or the files that send them.
 * Each row fact names its owning transition and a sample; every other event names the files that send it.
 * EventProducerTest fails on any producer not listed here.
 */
return [
    ProcessRunOutlasted::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ProcessRun::recordHeartbeat',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ProcessRunOutlasted('run', new ActorIdentity(ActorType::Agent, 'agent')),
    ],
    BundleActivated::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Commands/ApproveRuleBundle/ApproveRuleBundleHandler.php',
        ],
    ],
    EvidenceFoundInvalid::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Support/PartAssessments.php',
        ],
    ],
    OutputChunkCommitted::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Support/SpoolRecorder.php',
        ],
    ],
    RuleActivated::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Support/RuleApprovals.php',
        ],
    ],
    RuleRejected::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Commands/RejectRuleProposal/RejectRuleProposalHandler.php',
        ],
    ],
    RuleRetired::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Commands/RetireCommandRule/RetireCommandRuleHandler.php',
        ],
    ],
    RunChanged::class => [
        'role' => EventRole::Projection,
        'migrated' => false,
        'producers' => [
            'app/Support/RunUpdates.php',
        ],
    ],
    RunOutcomeRecorded::class => [
        'role' => EventRole::RowFact,
        'owner' => ['RunOutcome::create', 'RunOutcome::correct'],
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new RunOutcomeRecorded('run', 'attempt', RunLogicalResult::Failed, false),
    ],
    ProcessRunMarkedStale::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ProcessRun::markStale',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ProcessRunMarkedStale('run', 'the checkout moved'),
    ],
    ProcessRunUpdateCounted::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ProcessRun::nextUpdate',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ProcessRunUpdateCounted('run', 1),
    ],
    ProcessRunConsumed::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ProcessRun::consumeFor',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ProcessRunConsumed('run'),
    ],
    ProcessRunLost::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ProcessRun::markLost',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ProcessRunLost('run'),
    ],
    ProcessRunStopped::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ProcessRun::markStopped',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ProcessRunStopped('run', 'the user stopped it'),
    ],
    ProcessRunOutcomeUserRevoked::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ProcessRun::revokeOutcomeUser',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ProcessRunOutcomeUserRevoked('run'),
    ],
    ReaderPositionFailed::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ReaderPosition::markFailed',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ReaderPositionFailed('position'),
    ],
    ReaderPositionRewound::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ReaderPosition::rewindTo',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ReaderPositionRewound('position'),
    ],
    ReaderPositionAdvanced::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ReaderPosition::advance',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ReaderPositionAdvanced('position'),
    ],
    ResultReceiptSuperseded::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ResultReceipt::supersedeBy',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ResultReceiptSuperseded('receipt', 'newer'),
    ],
    ClassificationRuleRetired::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ClassificationRule::retire',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ClassificationRuleRetired('rule', 'reason'),
    ],
    EvidencePermitConsumed::class => [
        'role' => EventRole::RowFact,
        'owner' => 'EvidencePermit::consume',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new EvidencePermitConsumed('permit', 'run'),
    ],
    EvidencePermitExpired::class => [
        'role' => EventRole::RowFact,
        'owner' => 'EvidencePermit::expire',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new EvidencePermitExpired('permit'),
    ],
    RuleProposalWithdrawn::class => [
        'role' => EventRole::RowFact,
        'owner' => 'RuleProposal::withdraw',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new RuleProposalWithdrawn('proposal'),
    ],
    RuleProposalAdopted::class => [
        'role' => EventRole::RowFact,
        'owner' => 'RuleProposal::adopt',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new RuleProposalAdopted('proposal'),
    ],
    PartRunStarted::class => [
        'role' => EventRole::RowFact,
        'owner' => 'PartRun::start',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new PartRunStarted('part', 'host'),
    ],
    PartRunProcessFinished::class => [
        'role' => EventRole::RowFact,
        'owner' => 'PartRun::finishProcess',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new PartRunProcessFinished('part'),
    ],
    PartRunDrained::class => [
        'role' => EventRole::RowFact,
        'owner' => 'PartRun::finishDraining',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new PartRunDrained('part'),
    ],
    PartRunCaptured::class => [
        'role' => EventRole::RowFact,
        'owner' => 'PartRun::captureUpTo',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new PartRunCaptured('part'),
    ],
    PartRunCaptureMarked::class => [
        'role' => EventRole::RowFact,
        'owner' => 'PartRun::markCapture',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new PartRunCaptureMarked('part', CaptureState::cases()[0]),
    ],
    PartRunStopped::class => [
        'role' => EventRole::RowFact,
        'owner' => 'PartRun::stop',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new PartRunStopped('part', 'reason'),
    ],
    PartRunLost::class => [
        'role' => EventRole::RowFact,
        'owner' => 'PartRun::lose',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new PartRunLost('part'),
    ],
    PartRunSpawnFailed::class => [
        'role' => EventRole::RowFact,
        'owner' => 'PartRun::failToSpawn',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new PartRunSpawnFailed('part', 'reason'),
    ],
    PartRunSkipped::class => [
        'role' => EventRole::RowFact,
        'owner' => 'PartRun::skip',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new PartRunSkipped('part'),
    ],
];
