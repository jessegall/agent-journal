<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The message a chat row replies to: named when the viewer may see it, otherwise only said to be unavailable.
 */
#[TypeScript]
final class ReplyTargetData extends Data
{
    public function __construct(
        public readonly string|null $id,
        public readonly bool $visible,
    ) {}
}
