<?php

declare(strict_types=1);

namespace App\Access\Contracts;

use App\Access\Exceptions\SharingNotAllowed;
use App\Actors\Contracts\Actor;
use App\Support\RecordIdentity;

/**
 * Who may manage shares, the current configured owner only, and whether a record may be disclosed publicly now, as
 * its own provider decides.
 */
interface SharePolicy
{
    /**
     * Whether the actor may create and change shares.
     */
    public function mayManage(Actor $actor): bool;

    /**
     * @throws SharingNotAllowed
     */
    public function assertManager(Actor $actor): void;

    /**
     * Whether the record may be shown outside the journal.
     */
    public function mayDisclose(RecordIdentity $record): bool;
}
