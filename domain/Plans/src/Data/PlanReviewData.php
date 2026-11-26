<?php

declare(strict_types=1);

namespace Domain\Plans\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A plan's review and ending as its reader shows them: the review actions the caller may take, whether they may cancel
 * or finish the plan, the revision read, what assigning its work would move, the review asked for, the latest approval
 * and the note of a request for changes.
 */
#[TypeScript]
final class PlanReviewData extends Data
{
    public function __construct(
        public readonly bool $mayRequest,
        public readonly bool $mayWithdraw,
        public readonly bool $mayDecide,
        public readonly bool $mayCancel,
        public readonly bool $mayFinish,
        public readonly int $revision,
        public readonly PlanWorkPreviewData $work,
        public readonly int|null $reviewNumber = null,
        public readonly PlanReviewReceiptData|Optional $receipt = new Optional(),
        public readonly PlanReviewReceiptData|Optional $changesRequested = new Optional(),
    ) {}
}
