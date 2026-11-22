<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use App\Support\ResumableConversation;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A conversation of an agent that Resume may continue.
 */
#[TypeScript]
final class ResumableConversationData extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly string $driver,
        public readonly string $startedAt,
    ) {}

    public static function fromResumableConversation(ResumableConversation $conversation): self
    {
        return new self(
            $conversation->conversationId,
            $conversation->driver,
            $conversation->startedAt->toIso8601String(),
        );
    }
}
