<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use Spatie\LaravelData\Data;

/**
 * What a dock page's token carries, encrypted: whom and which conversation it was given for, the last placement read
 * or the end, and when it expires.
 */
final class DockCursorData extends Data
{
    public function __construct(
        public readonly string $viewer,
        public readonly string $conversation,
        public readonly string|null $assignedAt,
        public readonly string|null $placementId,
        public readonly bool $ended,
        public readonly int $expires,
    ) {}
}
