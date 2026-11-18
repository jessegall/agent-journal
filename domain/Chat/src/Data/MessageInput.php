<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use Spatie\LaravelData\Attributes\Validation\Regex;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * What the composer sends: the body exactly as typed (never trimmed, see bootstrap/app.php) and the target session.
 */
#[TypeScript]
final class MessageInput extends Data
{
    public function __construct(
        #[Regex('/\S/')] public readonly string $body,
        #[Ulid] public readonly string $session,
    ) {}
}
