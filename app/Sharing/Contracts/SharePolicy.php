<?php

declare(strict_types=1);

namespace App\Sharing\Contracts;

use App\Actors\Contracts\Actor;
use App\Records\Support\RecordIdentity;

/**
 * Who may manage shares, the current configured owner only, and whether a record may be disclosed publicly now, as
 * its own provider decides.
 */
interface SharePolicy
{
    public function mayManage(Actor $actor): bool;

    public function mayDisclose(RecordIdentity $record): bool;
}
