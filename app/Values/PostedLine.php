<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\LineCardPlacement;
use App\Support\Cards\DockIdentity;

/**
 * A plain line a domain posts to a chat: what it is about, what it says of it, and the record it shows as a card,
 * if any, inline or in the panel.
 */
final readonly class PostedLine
{
    public function __construct(
        public string $subject,
        public string $line,
        public DockIdentity|null $source,
        public LineCardPlacement $placement,
    ) {}
}
