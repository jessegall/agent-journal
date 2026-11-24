<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use App\Data\Messages\ReplyOriginal;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The message a chat row replies to: named, with who wrote it and one line of it, when the viewer may see it,
 * otherwise only said to be unavailable.
 */
#[TypeScript]
final class ReplyTargetData extends Data
{
    public function __construct(
        public readonly string|null $id,
        public readonly bool $visible,
        // Who wrote the original and one line of it, when the viewer may see it.
        public readonly ReplyOriginal|Optional $original = new Optional(),
    ) {}
}
