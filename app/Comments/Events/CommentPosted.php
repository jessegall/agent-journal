<?php

declare(strict_types=1);

namespace App\Comments\Events;

use App\Assignments\Support\RecordIdentity;
use App\Contracts\Event;
use App\Ui\Contracts\UpdatesUserInterface;

/**
 * A comment was left on a record. It carries no body or quote: a listener reads the comment if it may.
 */
final readonly class CommentPosted implements Event, UpdatesUserInterface
{
    public function __construct(public string $commentId, public RecordIdentity $target) {}
}
