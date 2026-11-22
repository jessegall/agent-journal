<?php

declare(strict_types=1);

namespace App\Values;

use Carbon\CarbonImmutable;

/**
 * A plain line in a chat's timeline: its position among the messages, what it is about, its words and when it was posted.
 */
final readonly class ChatLine
{
    public function __construct(
        public int $sequence,
        public string $subject,
        public string $line,
        public CarbonImmutable $postedAt,
    ) {}
}
