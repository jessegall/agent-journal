<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use Spatie\LaravelData\Attributes\Validation\Regex;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * What the composer sends: the body exactly as typed (never trimmed, see bootstrap/app.php) the agent it goes to and the session
 * the sender saw it run, so a message is never delivered to a session the sender did not see.
 */
#[TypeScript]
final class MessageInput extends Data
{
    public function __construct(
        #[Regex('/\S/')]
        public readonly string $body,
        #[Ulid]
        public readonly string $sourceInboxId,
        #[Ulid]
        public readonly string $destinationInboxId,
        #[Ulid]
        public readonly string $agent,
        #[Ulid]
        public readonly string|null $expectedSessionId,
        public readonly int $expectedGeneration,
    ) {}
}
