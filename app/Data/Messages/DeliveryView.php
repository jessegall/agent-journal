<?php

declare(strict_types=1);

namespace App\Data\Messages;

use App\Enums\WakeState;
use App\Support\ActorIdentity;

/**
 * Where waking one recipient about one message stands, and once it was given up, why and from which character of the
 * body the text still waits, with the piece an operator retries.
 */
final readonly class DeliveryView
{
    public function __construct(
        public string $messageId,
        public ActorIdentity $recipient,
        public WakeState $state,
        public string|null $reason,
        public int|null $pendingFrom,
        public string|null $exhaustedRangeId,
    ) {}
}
