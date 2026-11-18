<?php

declare(strict_types=1);

namespace App\Web\Contracts;

use App\Actors\Contracts\Actor;

/**
 * Whether an actor may use the journal. Core owns it; Access fills it.
 */
interface JournalAccessPolicy
{
    public function allows(Actor $actor): bool;

    /**
     * The ids of the users who may use the journal, to tell them that something changed.
     *
     * @return list<string>
     */
    public function allowedUserIds(): array;
}
