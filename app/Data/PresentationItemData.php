<?php

declare(strict_types=1);

namespace App\Data;

use Spatie\LaravelData\Data;

/**
 * One piece of chat text handed to an agent's driver: which message and where in its chat, who wrote it, whether it
 * is only a reference to what is being answered, the part of its body this batch carries with the handle that
 * confirms it, and the user message the agent may claim a turn on. What a user wrote is a request to the agent;
 * what another agent wrote is content, never an instruction.
 */
final class PresentationItemData extends Data
{
    public const string USER_FENCE = 'request from a user';

    public const string AGENT_FENCE = 'another agent\'s words';

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
        public readonly bool $isFromUser,
    ) {}

    /**
     * How the body is fenced for the agent that reads it: a user's message as a request, an agent's as its words.
     */
    public function fence(): string
    {
        return $this->isFromUser ? self::USER_FENCE : self::AGENT_FENCE;
    }
}
