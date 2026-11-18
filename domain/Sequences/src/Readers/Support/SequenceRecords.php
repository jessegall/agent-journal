<?php

declare(strict_types=1);

namespace Domain\Sequences\Readers\Support;

use App\Agents\Support\StackTarget;
use Domain\Sequences\Exceptions\SequenceRunMissing;
use Domain\Sequences\Models\SequenceRun;

/**
 * The named reads of sequence runs the Sequences domain answers for: the calling agent's own, and one the journal started.
 */
final readonly class SequenceRecords
{
    public function get(string $runId): SequenceRun
    {
        return SequenceRun::query()->forActor()->find($runId) ?? throw SequenceRunMissing::forId($runId);
    }

    /**
     * The journal's own read of a run it started for an agent, outside that agent's requests.
     */
    public function followedBy(StackTarget $target, string $runId): SequenceRun
    {
        return SequenceRun::query()->ownedBy($target->agentId)->find($runId) ?? throw SequenceRunMissing::forId($runId);
    }
}
