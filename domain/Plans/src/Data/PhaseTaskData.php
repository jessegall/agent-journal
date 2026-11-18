<?php

declare(strict_types=1);

namespace Domain\Plans\Data;

use Domain\Tasks\Api\TaskSummary;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One task of a phase, as the phase page lists it.
 */
#[TypeScript]
final class PhaseTaskData extends Data
{
    public function __construct(public readonly string $number, public readonly string $title) {}

    public static function fromSummary(TaskSummary $summary): self
    {
        return new self((string) $summary->number, $summary->title);
    }
}
