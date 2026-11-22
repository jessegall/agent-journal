<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A chat a leave or close acts on, named by its inbox.
 */
#[TypeScript]
final class ChatInput extends Data
{
    public function __construct(
        #[Ulid]
        public readonly string $inboxId,
    ) {}
}
