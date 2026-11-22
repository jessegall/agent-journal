<?php

declare(strict_types=1);

use App\Processes\Events\BundleActivated;
use App\Processes\Events\EvidenceInvalid;
use App\Processes\Events\OutputChunkCommitted;
use App\Processes\Events\RuleActivated;
use App\Processes\Events\RuleRejected;
use App\Processes\Events\RuleRetired;
use App\Processes\Events\RunChanged;
use App\Processes\Enums\RunLogicalResult;
use App\Processes\Events\RunOutcomeRecorded;
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
            'app/Processes/Handlers/ApproveRuleBundleHandler.php',
        ],
    ],
    EvidenceInvalid::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Processes/Support/PartAssessments.php',
        ],
    ],
    OutputChunkCommitted::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Processes/Support/SpoolRecorder.php',
        ],
    ],
    RuleActivated::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Processes/Support/RuleApprovals.php',
        ],
    ],
    RuleRejected::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Processes/Handlers/RejectRuleProposalHandler.php',
        ],
    ],
    RuleRetired::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Processes/Handlers/RetireCommandRuleHandler.php',
        ],
    ],
    RunChanged::class => [
        'role' => EventRole::Projection,
        'migrated' => false,
        'producers' => [
            'app/Processes/Support/RunUpdates.php',
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
