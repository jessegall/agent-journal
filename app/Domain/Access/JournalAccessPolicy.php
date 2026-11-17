<?php

declare(strict_types=1);

namespace App\Domain\Access;

use App\Core\Actors\Actor;
use Illuminate\Container\Attributes\Bind;

/**
 * Whether an actor may use the journal.
 */
#[Bind(JournalAccess::class)]
interface JournalAccessPolicy
{
    public function allows(Actor $actor): bool;

    /**
     * The ids of the people who may use the journal, to tell them that something changed.
     *
     * @return list<int>
     */
    public function allowedPersonIds(): array;
}
