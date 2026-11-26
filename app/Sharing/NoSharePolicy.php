<?php

declare(strict_types=1);

namespace App\Sharing;

use App\Actors\Contracts\Actor;
use App\Sharing\Contracts\SharePolicy;
use App\Sharing\Exceptions\SharingNotAllowed;
use App\Support\RecordIdentity;

/**
 * Nobody shares and nothing is disclosed: the answer when nothing lets records be shared publicly.
 */
final readonly class NoSharePolicy implements SharePolicy
{
    public function mayManage(Actor $actor): bool
    {
        return false;
    }

    public function assertManager(Actor $actor): void
    {
        throw SharingNotAllowed::forActor($actor);
    }

    public function mayDisclose(RecordIdentity $record): bool
    {
        return false;
    }
}
