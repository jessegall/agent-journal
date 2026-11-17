<?php

declare(strict_types=1);

namespace App\Domain\Sequences;

use App\Domain\Sequences\Models\SequenceRun;

/**
 * The named reads of sequence runs the Sequences domain answers for.
 */
final readonly class SequenceRecords
{
    public function get(int $runId): SequenceRun
    {
        return SequenceRun::query()->find($runId) ?? throw SequenceRunMissing::forId($runId);
    }
}
