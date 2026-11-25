<?php

declare(strict_types=1);

use App\Enums\Reviews\CodeReviewState;
use App\Enums\Reviews\MergeAttemptState;
use App\Enums\Reviews\MergeRefusalReason;
use App\Enums\Reviews\RepairRequestState;
use App\Events\Reviews\CodeReviewImportFailed;
use App\Events\Reviews\CodeReviewOpened;
use App\Events\Reviews\CodeReviewSettled;
use App\Events\Reviews\MergeAttemptAcknowledged;
use App\Events\Reviews\MergeAttemptBecameUncertain;
use App\Events\Reviews\MergeAttemptMerged;
use App\Events\Reviews\MergeAttemptRefused;
use App\Events\Reviews\MergeAttemptResolvedByOwner;
use App\Events\Reviews\MergeAttemptStarted;
use App\Events\Reviews\RepairRequestSettled;
use App\Events\Reviews\ReviewDecisionMergeLinked;
use App\Events\Reviews\WorkerReservationEmptied;
use App\Events\Reviews\WorkerReservationOccupied;
use App\Events\Reviews\WorkerReservationReleased;
use App\Events\Reviews\WorkReservationHandedOff;
use App\Events\Reviews\WorkReservationReleased;
use Tests\Architecture\Support\EventRole;

/**
 * The events of reviews with their role, owning transition or the files that send them.
 * Each row fact names its owning transition and a sample; every other event names the files that send it.
 * EventProducerTest fails on any producer not listed here.
 */
return [
    CodeReviewImportFailed::class => [
        'role' => EventRole::RowFact,
        'owner' => 'CodeReview::failImport',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new CodeReviewImportFailed('review'),
    ],
    CodeReviewOpened::class => [
        'role' => EventRole::RowFact,
        'owner' => 'CodeReview::open',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new CodeReviewOpened('review', 'ask'),
    ],
    CodeReviewSettled::class => [
        'role' => EventRole::RowFact,
        'owner' => 'CodeReview::settle',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new CodeReviewSettled('review', CodeReviewState::cases()[0]),
    ],
    MergeAttemptAcknowledged::class => [
        'role' => EventRole::RowFact,
        'owner' => 'MergeAttempt::acknowledge',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new MergeAttemptAcknowledged('attempt'),
    ],
    MergeAttemptResolvedByOwner::class => [
        'role' => EventRole::RowFact,
        'owner' => 'MergeAttempt::resolveByOwner',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new MergeAttemptResolvedByOwner('attempt', MergeAttemptState::cases()[0]),
    ],
    MergeAttemptStarted::class => [
        'role' => EventRole::RowFact,
        'owner' => 'MergeAttempt::apply',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new MergeAttemptStarted('attempt'),
    ],
    MergeAttemptMerged::class => [
        'role' => EventRole::RowFact,
        'owner' => 'MergeAttempt::merged',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new MergeAttemptMerged('attempt', 'commit'),
    ],
    MergeAttemptRefused::class => [
        'role' => EventRole::RowFact,
        'owner' => 'MergeAttempt::refuse',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new MergeAttemptRefused('attempt', MergeRefusalReason::cases()[0]),
    ],
    MergeAttemptBecameUncertain::class => [
        'role' => EventRole::RowFact,
        'owner' => 'MergeAttempt::becomeUncertain',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new MergeAttemptBecameUncertain('attempt'),
    ],
    RepairRequestSettled::class => [
        'role' => EventRole::RowFact,
        'owner' => 'RepairRequest::settle',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new RepairRequestSettled('request', RepairRequestState::cases()[0]),
    ],
    ReviewDecisionMergeLinked::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ReviewDecision::linkMerge',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ReviewDecisionMergeLinked('decision', 'ask'),
    ],
    WorkerReservationOccupied::class => [
        'role' => EventRole::RowFact,
        'owner' => 'WorkerReservation::occupy',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new WorkerReservationOccupied('reservation'),
    ],
    WorkerReservationReleased::class => [
        'role' => EventRole::RowFact,
        'owner' => 'WorkerReservation::release',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new WorkerReservationReleased('reservation'),
    ],
    WorkerReservationEmptied::class => [
        'role' => EventRole::RowFact,
        'owner' => 'WorkerReservation::releaseAll',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new WorkerReservationEmptied('reservation'),
    ],
    WorkReservationHandedOff::class => [
        'role' => EventRole::RowFact,
        'owner' => 'WorkReservation::handOff',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new WorkReservationHandedOff('reservation'),
    ],
    WorkReservationReleased::class => [
        'role' => EventRole::RowFact,
        'owner' => 'WorkReservation::release',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new WorkReservationReleased('reservation'),
    ],
];
