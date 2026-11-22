<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * What a chat window asks for: the events of a chat after its cursor, or a fresh snapshot when it has none.
 */
#[TypeScript]
final class ChatEventsInput extends Data
{
    public function __construct(
        #[Ulid]
        public readonly string $inboxId,
        #[Max(4096)]
        public readonly string|null $cursor = null,
    ) {}
}
