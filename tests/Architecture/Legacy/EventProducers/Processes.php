<?php

declare(strict_types=1);

use App\Processes\Events\BundleActivated;
use App\Processes\Events\EvidenceInvalid;
use App\Processes\Events\OutputChunkCommitted;
use App\Processes\Events\RuleActivated;
use App\Processes\Events\RuleRejected;
use App\Processes\Events\RuleRetired;
use App\Processes\Events\RunChanged;
use Tests\Architecture\Support\EventRole;

/**
 * The events of Processes with their role, owning transition and the files that send them today (doc 70, table 1).
 * Each migration slice sets migrated, names a sample, and leaves its owner the one producer; EventProducerTest fails
 * on any producer not listed here.
 */
return [
    BundleActivated::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ModuleRuleBundle::approve',
        'migrated' => false,
        'producers' => [
            'app/Processes/Handlers/ApproveRuleBundleHandler.php',
        ],
    ],
    EvidenceInvalid::class => [
        'role' => EventRole::RowFact,
        'owner' => 'OutputAssessment::record',
        'migrated' => false,
        'producers' => [
            'app/Processes/Support/PartAssessments.php',
        ],
    ],
    OutputChunkCommitted::class => [
        'role' => EventRole::RowFact,
        'owner' => 'OutputChunk::create',
        'migrated' => false,
        'producers' => [
            'app/Processes/Support/SpoolRecorder.php',
        ],
    ],
    RuleActivated::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ClassificationRule::activate',
        'migrated' => false,
        'producers' => [
            'app/Processes/Support/RuleApprovals.php',
        ],
    ],
    RuleRejected::class => [
        'role' => EventRole::RowFact,
        'owner' => 'RuleProposal::reject',
        'migrated' => false,
        'producers' => [
            'app/Processes/Handlers/RejectRuleProposalHandler.php',
        ],
    ],
    RuleRetired::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ClassificationRule::retire',
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
];
