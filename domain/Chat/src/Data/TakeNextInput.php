<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The inbox a user takes the next waiting question from.
 */
#[TypeScript]
final class TakeNextInput extends Data
{
    public function __construct(
        #[Ulid]
        public readonly string $inboxId,
    ) {}
}
