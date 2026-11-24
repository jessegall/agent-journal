<?php

declare(strict_types=1);

use Domain\Helpers\Events\HelperDesignated;
use Domain\Helpers\Events\HelperDesignationReleased;
use Domain\Helpers\Events\HelperJobCancelled;
use Domain\Helpers\Events\HelperJobHeld;
use Domain\Helpers\Events\HelperJobLeftUnfinished;
use Domain\Helpers\Events\HelperJobReopenedForAttempt;
use Domain\Helpers\Events\HelperJobReopenedForRepair;
use Domain\Helpers\Events\HelperJobReported;
use Domain\Helpers\Events\HelperJobSteered;
use Domain\Helpers\Events\HelperNoticeDelivered;
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
        'sample' => fn () => new ReportJobLinked('report', 1, 'job'),
    ],
    HelperDesignated::class => [
        'role' => EventRole::RowFact,
        'owner' => 'HelperIdentity::designate',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new HelperDesignated('identity'),
    ],
    HelperDesignationReleased::class => [
        'role' => EventRole::RowFact,
        'owner' => 'HelperIdentity::releaseDesignation',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new HelperDesignationReleased('identity'),
    ],
    HelperJobReopenedForAttempt::class => [
        'role' => EventRole::RowFact,
        'owner' => 'HelperJob::reopenForAttempt',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new HelperJobReopenedForAttempt('job'),
    ],
    HelperJobReopenedForRepair::class => [
        'role' => EventRole::RowFact,
        'owner' => 'HelperJob::reopenForRepair',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new HelperJobReopenedForRepair('job'),
    ],
    HelperJobSteered::class => [
        'role' => EventRole::RowFact,
        'owner' => 'HelperJob::addSteering',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new HelperJobSteered('job'),
    ],
    HelperJobReported::class => [
        'role' => EventRole::RowFact,
        'owner' => 'HelperJob::finish',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new HelperJobReported('job', 'report'),
    ],
    HelperJobCancelled::class => [
        'role' => EventRole::RowFact,
        'owner' => 'HelperJob::cancel',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new HelperJobCancelled('job'),
    ],
    HelperJobHeld::class => [
        'role' => EventRole::RowFact,
        'owner' => 'HelperJob::hold',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new HelperJobHeld('job'),
    ],
    HelperJobLeftUnfinished::class => [
        'role' => EventRole::RowFact,
        'owner' => 'HelperJob::markUnfinished',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new HelperJobLeftUnfinished('job'),
    ],
    HelperNoticeDelivered::class => [
        'role' => EventRole::RowFact,
        'owner' => 'HelperNotice::markDelivered',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new HelperNoticeDelivered('notice'),
    ],
];
