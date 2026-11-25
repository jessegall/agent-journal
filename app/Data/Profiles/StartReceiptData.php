<?php

declare(strict_types=1);

namespace App\Data\Profiles;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Where a submitted start stands: pending, accepted with its session and process generation, or refused with its
 * reason code, explanation and one next step.
 */
#[TypeScript]
final class StartReceiptData extends Data
{
    public function __construct(
        public readonly string $requestId,
        public readonly string $state,
        public readonly string|null|Optional $sessionId,
        public readonly int|null|Optional $generation,
        public readonly string|Optional $reasonCode,
        public readonly string|Optional $explanation,
        public readonly string|Optional $remedy,
    ) {}
}
