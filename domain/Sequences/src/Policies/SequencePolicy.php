<?php

declare(strict_types=1);

namespace Domain\Sequences\Policies;

use App\Contracts\Authorization\Policy;
use Domain\Sequences\Models\SequenceRun;

/**
 * Who may work with sequences: every granted actor, so the grants decide.
 */
final readonly class SequencePolicy implements Policy
{
    public static function model(): string
    {
        return SequenceRun::class;
    }
}
