<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Regex;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A reply to one message at the version the user saw.
 */
#[TypeScript]
final class ReplyInput extends Data
{
    public function __construct(
        #[Ulid]
        public readonly string $messageId,
        #[Min(0)]
        public readonly int $stateVersion,
        #[Regex('/\S/')]
        public readonly string $body,
        #[Ulid]
        public readonly string $agent,
    ) {}
}
