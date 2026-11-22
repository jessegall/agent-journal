<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Regex;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A chat question the viewer declines, with why.
 */
#[TypeScript]
final class DeclineInput extends Data
{
    public function __construct(
        #[Ulid]
        public readonly string $messageId,
        #[Regex('/\S/'), Max(2000)]
        public readonly string $reason,
    ) {}
}
