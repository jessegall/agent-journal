<?php

declare(strict_types=1);

namespace Domain\Documents\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One settlement in a record's history: who settled it, why, when, and for a document the revision it was at.
 */
#[TypeScript]
final class SettlementCard extends Data
{
    public function __construct(
        public readonly string $actorType,
        public readonly string $actorId,
        public readonly string $reason,
        public readonly string|null $revision,
        public readonly string $settledAt,
    ) {}
}
