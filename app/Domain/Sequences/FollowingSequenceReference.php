<?php

declare(strict_types=1);

namespace App\Domain\Sequences;

use App\Domain\Hooks\Decisions\StateReference;
use App\Domain\Hooks\Decisions\SubjectReference;
use App\Domain\Sequences\Models\SequenceRun;

/**
 * The stack reference of following one sequence run; each run is its own subject.
 */
final class FollowingSequenceReference
{
    public const TYPE_KEY = 'sequences.following';

    public static function forRun(SequenceRun $run): StateReference
    {
        return new StateReference(self::TYPE_KEY, new SubjectReference($run->id, 1));
    }
}
