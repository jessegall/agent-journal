<?php

declare(strict_types=1);

namespace Domain\Plans\Data;

use App\Enums\ActorType;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A decided edition as its reader names it: the edition, who decided and when, the reason of a request for changes,
 * and whether an approval is historical because the plan changed since.
 */
#[TypeScript]
final class PlanReviewReceiptData extends Data
{
    public function __construct(
        public readonly int $editionNumber,
        public readonly ActorType $decidedByType,
        public readonly string $decidedById,
        public readonly string $decidedAt,
        public readonly bool $isHistorical,
        public readonly string|Optional $reason = new Optional(),
    ) {}
}
