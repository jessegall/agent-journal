<?php

declare(strict_types=1);

namespace App\Communication\Data;

/**
 * How many of an inbox's incoming messages are unread, and how many waiting ones nobody or somebody has taken up.
 */
final readonly class InboxCounts
{
    public function __construct(
        public int $unread,
        public int $unclaimed,
        public int $claimed,
    ) {}
}
