<?php

declare(strict_types=1);

namespace App\Communication\Support;

use App\Actors\Support\ActorIdentity;
use App\Communication\Enums\IntervalRole;
use App\Communication\Models\InboxInterval;

/**
 * One member's active stretch in a chat inbox as a domain reads it: which interval, whose, in what role and from
 * which timeline position.
 */
final readonly class ChatInterval
{
    public function __construct(
        public string $intervalId,
        public string $inboxId,
        public ActorIdentity $actor,
        public IntervalRole $role,
        public int $joinedSequence,
    ) {}

    public static function of(InboxInterval $interval): self
    {
        return new self(
            $interval->id,
            $interval->inbox_id,
            $interval->actor,
            $interval->role,
            $interval->joined_sequence,
        );
    }
}
