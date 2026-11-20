<?php

declare(strict_types=1);

namespace App\Profiles\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class ScriptDiagnostic extends Data
{
    public function __construct(
        public readonly string $message,
        public readonly int $start,
        public readonly int $end,
    ) {}
}
