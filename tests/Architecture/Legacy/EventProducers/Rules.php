<?php

declare(strict_types=1);

use Domain\Rules\Api\Events\RuleApproved;
use Domain\Rules\Api\Events\RuleDenied;
use Domain\Rules\Api\Events\RuleRemoved;
use Tests\Architecture\Support\EventRole;

/**
 * The events of Rules with their role, owning transition and the files that send them today (doc 70, table 1).
 * Each migration slice sets migrated, names a sample, and leaves its owner the one producer; EventProducerTest fails
 * on any producer not listed here.
 */
return [
    RuleApproved::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Rule::approveBy',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new RuleApproved('rule'),
    ],
    RuleDenied::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Rule::deny',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new RuleDenied('rule'),
    ],
    RuleRemoved::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Rule::remove',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new RuleRemoved('rule'),
    ],
];
