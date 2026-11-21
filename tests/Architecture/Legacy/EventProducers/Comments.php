<?php

declare(strict_types=1);

use App\Comments\Events\CommentPosted;
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
        'migrated' => false,
        'producers' => [
            'app/Comments/Support/CommentEvents.php',
        ],
    ],
];
