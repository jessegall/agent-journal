<?php

declare(strict_types=1);

namespace App\Contracts\Sharing;

use App\Contracts\Actors\Actor;
use App\Exceptions\SharingNotAllowed;
use App\Support\RecordIdentity;

/**
 * Who may manage shares, the current configured owner only, and whether a record may be disclosed publicly now, as
 * its own provider decides.
 */
interface SharePolicy
{
    public function mayManage(Actor $actor): bool;

    /**
     * @throws SharingNotAllowed
     */
    public function assertManager(Actor $actor): void;

    public function mayDisclose(RecordIdentity $record): bool;
}
