<?php

declare(strict_types=1);

namespace App\Actors\Contracts;

use App\Actors\Exceptions\ConsoleOwnerMissing;
use App\Actors\Support\ActorContext;

/**
 * Who may join the journal, and the owner it admits for work no one signed in for. Core owns it; Access fills it.
 */
interface JournalAdmission
{
    public function admits(Actor $actor): bool;

    /**
     * The configured owner, for work such as a console command that no signed-in user starts.
     *
     * @throws ConsoleOwnerMissing
     */
    public function owner(): ActorContext;
}
