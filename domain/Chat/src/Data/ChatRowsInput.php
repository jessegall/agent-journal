<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * What a chat window asks for when it pages its rows: the chat, and the cursor of the older page it wants, or none
 * for the newest page.
 */
#[TypeScript]
final class ChatRowsInput extends Data
{
    public function __construct(
        #[Ulid]
        public readonly string $inboxId,
        #[Max(4096)]
        public readonly string|null $beforeId = null,
    ) {}
}
