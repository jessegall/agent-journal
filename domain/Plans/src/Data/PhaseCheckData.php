<?php

declare(strict_types=1);

namespace Domain\Plans\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A phase's latest check receipt as its page shows it: what was checked, how it came out, when it was recorded, and
 * whether that was after the phase's tasks last changed.
 */
#[TypeScript]
final class PhaseCheckData extends Data
{
    public function __construct(
        public readonly string $operation,
        public readonly string $outcome,
        public readonly string $recordedAt,
        public readonly bool $isAfterLastChange,
    ) {}
}
