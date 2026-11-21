<?php

declare(strict_types=1);

use App\Comments\Events\CommentPosted;
use App\Records\Support\RecordIdentity;
use Tests\Architecture\Support\EventRole;

/**
 * The events of Comments with their role, owning transition and the files that send them today (doc 70, table 1).
 * Each migration slice sets migrated, names a sample, and leaves its owner the one producer; EventProducerTest fails
 * on any producer not listed here.
 */
return [
    CommentPosted::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Comment::create',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new CommentPosted('comment', new RecordIdentity('documents.document', '01jd8x0g9m3qz6v4k2pr0p0se1')),
    ],
];
