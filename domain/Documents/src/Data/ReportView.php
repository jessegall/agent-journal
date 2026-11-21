<?php

declare(strict_types=1);

namespace Domain\Documents\Data;

use Domain\Documents\Enums\AttentionState;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One report with its text.
 */
#[TypeScript]
final class ReportView extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly string $number,
        public readonly string $title,
        public readonly string $abstract,
        public readonly string $body,
        public readonly string $creatorType,
        public readonly string $creatorId,
        public readonly AttentionState $attention,
        public readonly string $filedAt,
    ) {}
}
