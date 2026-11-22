<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Regex;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A reaction the viewer adds to a message in a chat, or takes back when it already reacted with that emoji.
 */
#[TypeScript]
final class ReactInput extends Data
{
    public function __construct(
        #[Ulid]
        public readonly string $inboxId,
        #[Ulid]
        public readonly string $messageId,
        #[Regex('/\S/'), Max(16)]
        public readonly string $emoji,
    ) {}
}
