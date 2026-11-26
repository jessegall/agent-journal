<?php

declare(strict_types=1);

namespace Domain\Sequences\Policies;

use App\Access\Contracts\Policy;
use Domain\Sequences\Models\Sequence;

/**
 * Who may read, create and edit the stored sequences, as the access grants for them say.
 */
final readonly class StoredSequencePolicy implements Policy
{
    public static function model(): string
    {
        return Sequence::class;
    }
}
