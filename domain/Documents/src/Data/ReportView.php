<?php

declare(strict_types=1);

namespace Domain\Documents\Data;

use Domain\Documents\Enums\AttentionState;
use Domain\Documents\Models\Report;
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

    /**
     * A report as its page shows it: its text, who filed it and its attention.
     */
    public static function fromReport(Report $report): self
    {
        return new self(
            $report->id,
            (string) $report->number,
            $report->title,
            $report->abstract,
            $report->body,
            $report->creator_type->value,
            $report->creator_id,
            $report->attention,
            $report->filed_at->toIso8601String(),
        );
    }
}
