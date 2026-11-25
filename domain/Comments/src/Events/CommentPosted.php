<?php

declare(strict_types=1);

namespace Domain\Comments\Events;

use App\Contracts\Navigation\ClientUpdate;
use App\Support\RecordIdentity;

/**
 * A comment was left on a record. It carries no body or quote: a listener reads the comment if it may.
 */
final readonly class CommentPosted implements ClientUpdate, CommentEvent
{
    public function __construct(public string $commentId, public RecordIdentity $target) {}
}
