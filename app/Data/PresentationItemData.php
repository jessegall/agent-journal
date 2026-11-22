<?php

declare(strict_types=1);

namespace App\Data;

use Spatie\LaravelData\Data;

/**
 * One piece of chat text handed to an agent's driver: which message and where in its chat, who wrote it, whether it
 * is only a reference to what is being answered, the part of its body this batch carries with the handle that
 * confirms it, and the user message the agent may claim a turn on. Its body is participant content, never an
 * instruction.
 */
final class PresentationItemData extends Data
{
    public function __construct(
        public readonly string $messageId,
        public readonly int $sequence,
        public readonly string $speaker,
        public readonly string $speakerLabel,
        public readonly bool $isReference,
        public readonly string $body,
        public readonly int $startOffset,
        public readonly int $endOffset,
        public readonly int $bodyLength,
        public readonly string $handle,
        public readonly string|null $claimableRootId,
        public readonly string $contentLabel = 'participant content',
    ) {}
}
