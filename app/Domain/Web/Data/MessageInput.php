<?php

declare(strict_types=1);

namespace App\Domain\Web\Data;

use Spatie\LaravelData\Attributes\Validation\Regex;
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
        #[Regex('/^[1-9][0-9]{0,18}$/')] public readonly string $session,
    ) {}
}
