<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\LineCardPlacement;
use App\Support\Cards\DockIdentity;
use Carbon\CarbonImmutable;

/**
 * A plain line in a chat's timeline: its position among the messages, what it is about, its words, the record it
 * shows as a card, if any, and when it was posted.
 */
final readonly class ChatLine
{
    public function __construct(
        public int $sequence,
        public string $subject,
        public string $line,
        public DockIdentity|null $source,
        public LineCardPlacement $cardPlacement,
        public CarbonImmutable $postedAt,
    ) {}
}
