<?php

declare(strict_types=1);

use Domain\Access\Events\EnvironmentUserGrantRevoked;
use Tests\Architecture\Support\EventRole;

/**
 * The events of Access with their role, owning transition or the files that send them.
 * Each row fact names its owning transition and a sample; every other event names the files that send it.
 * EventProducerTest fails on any producer not listed here.
 */
return [
    EnvironmentUserGrantRevoked::class => [
        'role' => EventRole::RowFact,
        'owner' => 'EnvironmentUserGrant::revoke',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new EnvironmentUserGrantRevoked('grant'),
    ],
];
