<?php

declare(strict_types=1);

namespace Domain\Plans\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A plan's review as its reader shows it: which review actions the caller may take, the edition asked for with its
 * frozen snapshot, the latest approval as a receipt (historical once the plan changed), the note of a request for
 * changes, and what changed against the edition before.
 */
#[TypeScript]
final class PlanReviewData extends Data
{
    public function __construct(
        public readonly bool $mayRequest,
        public readonly bool $mayWithdraw,
        public readonly bool $mayDecide,
        public readonly PlanReviewEditionData|Optional $edition = new Optional(),
        public readonly PlanReviewReceiptData|Optional $receipt = new Optional(),
        public readonly PlanReviewReceiptData|Optional $changesRequested = new Optional(),
        public readonly PlanEditionChangesData|Optional $changes = new Optional(),
    ) {}
}
