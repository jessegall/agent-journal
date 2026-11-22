<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Events\Event;
use App\Contracts\Navigation\UserInterfaceUpdater;
use App\Support\RecordIdentity;

/**
 * A comment was left on a record. It carries no body or quote: a listener reads the comment if it may.
 */
final readonly class CommentPosted implements Event, UserInterfaceUpdater
{
    public function __construct(public string $commentId, public RecordIdentity $target) {}
}
