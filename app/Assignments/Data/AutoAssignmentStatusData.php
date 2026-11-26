<?php

declare(strict_types=1);

namespace App\Assignments\Data;

use App\Assignments\AssignmentTotals;
use App\Assignments\AutoAssignmentView;
use App\Assignments\PoolDescription;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

/**
 * An auto-assignment's status as a call answers it; what the reader may not see or what is not known is left out.
 * The last assignment time says when an item was last given, never whether anything is healthy.
 */
final class AutoAssignmentStatusData extends Data
{
    public function __construct(
        public readonly bool $isEnabled,
        public readonly string $state,
        public readonly string $stateLabel,
        public readonly int $revision,
        public readonly string|Optional $pool = new Optional(),
        public readonly int|Optional $size = new Optional(),
        public readonly int|Optional $held = new Optional(),
        public readonly int|Optional $room = new Optional(),
        public readonly string|Optional $lastAssignedAt = new Optional(),
    ) {}

    public static function of(AutoAssignmentView $status): self
    {
        return self::from([
            'isEnabled' => $status->isEnabled,
            'state' => $status->status->value,
            'stateLabel' => $status->status->label(),
            'revision' => $status->revision,
            'pool' => $status->pool->map(fn (PoolDescription $pool) => $pool->label)->getOrElse(Optional::create()),
            'size' => $status->size->getOrElse(Optional::create()),
            'held' => $status->totals
                ->map(fn (AssignmentTotals $totals) => $totals->held)
                ->getOrElse(Optional::create()),
            'room' => $status->totals
                ->map(fn (AssignmentTotals $totals) => $totals->room)
                ->getOrElse(Optional::create()),
            'lastAssignedAt' => $status->lastAssignedAt
                ->map(fn (CarbonImmutable $time) => $time->toIso8601String())
                ->getOrElse(Optional::create()),
        ]);
    }
}
