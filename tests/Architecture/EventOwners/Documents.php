<?php

declare(strict_types=1);

use App\Support\ActorReference;
use Domain\Documents\Events\DocumentClosed;
use Domain\Documents\Events\DocumentCreated;
use Domain\Documents\Events\DocumentDraftSaved;
use Domain\Documents\Events\DocumentFirstRevisionSet;
use Domain\Documents\Events\DocumentOpened;
use Domain\Documents\Events\DocumentPublished;
use Domain\Documents\Events\DraftKept;
use Domain\Documents\Events\RecordSettled;
use Domain\Documents\Events\ReportFiled;
use Domain\Documents\Events\TextUploadChunkCounted;
use Domain\Documents\Events\TextUploadConsumed;
use Domain\Documents\Events\TextUploadSealed;
use Tests\Architecture\Support\EventRole;

/**
 * The events of Documents with their role, owning transition or the files that send them.
 * Each row fact names its owning transition and a sample; every other event names the files that send it.
 * EventProducerTest fails on any producer not listed here.
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
        'sample' => fn () => new DocumentCreated('document', 1, ActorReference::forUser('user')),
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
        'sample' => fn () => new ReportFiled('report', 1, ActorReference::forUser('user')),
    ],
    DocumentFirstRevisionSet::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Document::startWith',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DocumentFirstRevisionSet('document', 'revision'),
    ],
    TextUploadChunkCounted::class => [
        'role' => EventRole::RowFact,
        'owner' => 'TextUpload::countChunk',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new TextUploadChunkCounted('upload'),
    ],
    TextUploadSealed::class => [
        'role' => EventRole::RowFact,
        'owner' => 'TextUpload::seal',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new TextUploadSealed('upload'),
    ],
    TextUploadConsumed::class => [
        'role' => EventRole::RowFact,
        'owner' => 'TextUpload::consume',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new TextUploadConsumed('upload'),
    ],
];
