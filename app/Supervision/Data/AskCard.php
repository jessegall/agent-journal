<?php

declare(strict_types=1);

namespace App\Supervision\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class AskCard extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly string $type,
        public readonly string $body,
        public readonly bool $open,
        public readonly bool $obligation,
        public readonly string|null $reply,
    ) {}
}
