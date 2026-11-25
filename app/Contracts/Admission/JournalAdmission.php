<?php

declare(strict_types=1);

namespace App\Contracts\Admission;

use App\Contracts\Actors\Actor;
use App\Exceptions\ConsoleOwnerMissing;
use App\Support\ActorIdentity;

/**
 * Who may join the journal, and the owner it admits for work no one signed in for. Core owns it; Access fills it.
 */
interface JournalAdmission
{
    /**
     * Whether the actor may use the journal at all.
     */
    public function admits(Actor $actor): bool;

    /**
     * The configured owner, for work such as a console command that no signed-in user starts.
     *
     * @throws ConsoleOwnerMissing
     */
    public function owner(): ActorIdentity;
}
