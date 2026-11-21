<?php

declare(strict_types=1);

use Domain\Rules\Api\Events\RuleApproved;
use Domain\Rules\Api\Events\RuleDenied;
use Domain\Rules\Api\Events\RuleRemoved;
use Tests\Architecture\Support\EventRole;

/**
 * The events of Rules with their role, owning transition or the files that send them.
 * Each row fact names its owning transition and a sample; every other event names the files that send it.
 * EventProducerTest fails on any producer not listed here.
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
