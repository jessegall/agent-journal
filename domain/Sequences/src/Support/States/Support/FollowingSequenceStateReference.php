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
final class FollowingSequenceStateReference extends StateReferenceFactory
{
    public const string TYPE_KEY = 'sequences.following';

    public static function forRun(SequenceRun $run): StateReference
    {
        return self::about(new SubjectReference($run->id, 1));
    }
}
