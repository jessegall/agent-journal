<?php

declare(strict_types=1);

namespace Domain\Sequences\Support\States\Support;

use App\Support\Decisions\StateReferenceFactory;
use App\Support\References\StateReference;
use App\Support\References\SubjectReference;
use Domain\Sequences\Models\SequenceRun;

/**
 * The stack reference of following one sequence run; each run is its own subject.
 */
final class FollowSequenceStateReference extends StateReferenceFactory
{
    public const string TYPE_KEY = 'sequences.follow';

    public static function forRun(SequenceRun $run): StateReference
    {
        return self::about(new SubjectReference($run->id, 1), [
            'runId' => $run->id,
            'runNumber' => $run->number,
            'steps' => $run->steps,
            'currentStep' => $run->current_step,
        ]);
    }
}
