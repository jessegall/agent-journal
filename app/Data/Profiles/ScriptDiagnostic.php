<?php

declare(strict_types=1);

namespace App\Data\Profiles;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class ScriptDiagnostic extends Data
{
    public function __construct(
        public readonly string $code,
        public readonly string $message,
        public readonly int $line,
        public readonly int $column,
        public readonly int $length,
        public readonly string $expectedForm,
    ) {}
}
