<?php

declare(strict_types=1);

use App\Actors\Support\ActorContext;
use Domain\Documents\Api\Events\DocumentClosed;
use Domain\Documents\Api\Events\DocumentCreated;
use Domain\Documents\Api\Events\DocumentDraftSaved;
use Domain\Documents\Api\Events\DocumentOpened;
use Domain\Documents\Api\Events\DocumentPublished;
use Domain\Documents\Api\Events\DraftKept;
use Domain\Documents\Api\Events\RecordSettled;
use Domain\Documents\Api\Events\ReportFiled;
use Tests\Architecture\Support\EventRole;

/**
 * The events of Documents with their role, owning transition and the files that send them today (doc 70, table 1).
 * Each migration slice sets migrated, names a sample, and leaves its owner the one producer; EventProducerTest fails
 * on any producer not listed here.
 */
return [
    DocumentClosed::class => [
        'role' => EventRole::RowFact,
        'owner' => 'DocumentClose::create',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DocumentClosed('document', 1, 2),
    ],
    DocumentCreated::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Document::create',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DocumentCreated('document', 1, ActorContext::forUser('user')),
    ],
    DocumentDraftSaved::class => [
        'role' => EventRole::RowFact,
        'owner' => 'DocumentDraft::saveText',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DocumentDraftSaved('document', 2),
    ],
    DocumentOpened::class => [
        'role' => EventRole::RowFact,
        'owner' => 'DocumentDraft::create',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DocumentOpened('document', 1),
    ],
    DocumentPublished::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Document::publish',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DocumentPublished('document', 1, 2),
    ],
    DraftKept::class => [
        'role' => EventRole::RowFact,
        'owner' => 'RetainedDraft::create',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DraftKept('draft', 'document', null),
    ],
    RecordSettled::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Settles::settle',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new RecordSettled('documents.document', 'document'),
    ],
    ReportFiled::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Report::create',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ReportFiled('report', 1, ActorContext::forUser('user')),
    ],
];
