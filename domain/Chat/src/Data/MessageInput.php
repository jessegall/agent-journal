<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use Spatie\LaravelData\Attributes\Validation\Regex;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * What the composer sends: the body exactly as typed (never trimmed, see bootstrap/app.php), the chat inbox it is
 * posted in under its request key, and the agent and session the sender saw run, so a message never reaches a session
 * the sender did not see.
 */
#[TypeScript]
final class MessageInput extends Data
{
    public function __construct(
        #[Regex('/\S/')]
        public readonly string $body,
        #[Ulid]
        public readonly string $inboxId,
        #[Regex('/^[A-Za-z0-9-]{1,64}$/')]
        public readonly string $requestKey,
        #[Ulid]
        public readonly string|null $agent = null,
        #[Ulid]
        public readonly string|null $expectedSessionId = null,
        public readonly int $expectedGeneration = 0,
    ) {}
}
