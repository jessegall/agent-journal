<?php

declare(strict_types=1);

namespace App\Data\Messages;

use App\Enums\TimelineEventType;
use App\Support\ActorIdentity;

/**
 * One event of a chat's timeline as a member reads it: its position, what happened and who did it, and for a message
 * its id and the handle the reader acknowledges it with.
 */
final readonly class ChatEventView
{
    public function __construct(
        public int $sequence,
        public TimelineEventType $type,
        public ActorIdentity $actor,
        public string|null $messageId,
        public string|null $acknowledgement,
    ) {}
}
