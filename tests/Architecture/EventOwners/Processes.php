<?php

declare(strict_types=1);

use App\Enums\RunLogicalResult;
use App\Events\BundleActivated;
use App\Events\EvidenceInvalid;
use App\Events\OutputChunkCommitted;
use App\Events\RuleActivated;
use App\Events\RuleRejected;
use App\Events\RuleRetired;
use App\Events\RunChanged;
use App\Events\RunOutcomeRecorded;
use Tests\Architecture\Support\EventRole;

/**
 * The events of Processes with their role, owning transition or the files that send them.
 * Each row fact names its owning transition and a sample; every other event names the files that send it.
 * EventProducerTest fails on any producer not listed here.
 */
return [
    BundleActivated::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Commands/ApproveRuleBundle/ApproveRuleBundleHandler.php',
        ],
    ],
    EvidenceInvalid::class => [
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
];
