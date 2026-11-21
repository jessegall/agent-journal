<?php

declare(strict_types=1);

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
        'owner' => 'DocumentDraft::closeInto',
        'migrated' => false,
        'producers' => [
            'domain/Documents/src/Support/DraftClosing.php',
        ],
    ],
    DocumentCreated::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Document::create',
        'migrated' => false,
        'producers' => [
            'domain/Documents/src/Handlers/CreateDocumentHandler.php',
        ],
    ],
    DocumentDraftSaved::class => [
        'role' => EventRole::RowFact,
        'owner' => 'DocumentDraft::saveText',
        'migrated' => false,
        'producers' => [
            'domain/Documents/src/Support/DraftEditing.php',
        ],
    ],
    DocumentOpened::class => [
        'role' => EventRole::RowFact,
        'owner' => 'DocumentDraft::create',
        'migrated' => false,
        'producers' => [
            'domain/Documents/src/Handlers/OpenDocumentHandler.php',
        ],
    ],
    DocumentPublished::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Document::addRevision',
        'migrated' => false,
        'producers' => [
            'domain/Documents/src/Support/DraftClosing.php',
        ],
    ],
    DraftKept::class => [
        'role' => EventRole::RowFact,
        'owner' => 'RetainedDraft::create',
        'migrated' => false,
        'producers' => [
            'domain/Documents/src/Support/DraftClosing.php',
        ],
    ],
    RecordSettled::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Settles::settle',
        'migrated' => false,
        'producers' => [
            'domain/Documents/src/Handlers/CloseReportHandler.php',
            'domain/Documents/src/Handlers/SettleDocumentHandler.php',
        ],
    ],
    ReportFiled::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Report::create',
        'migrated' => false,
        'producers' => [
            'domain/Documents/src/Handlers/CreateReportHandler.php',
        ],
    ],
];
