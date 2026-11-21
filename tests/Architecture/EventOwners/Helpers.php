<?php

declare(strict_types=1);

use Domain\Helpers\Events\ReportJobLinked;
use Tests\Architecture\Support\EventRole;

/**
 * The events of Helpers with their role, owning transition or the files that send them.
 * Each row fact names its owning transition and a sample; every other event names the files that send it.
 * EventProducerTest fails on any producer not listed here.
 */
return [
    ReportJobLinked::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ReportJobLink::create',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ReportJobLinked('report', 'job'),
    ],
];
