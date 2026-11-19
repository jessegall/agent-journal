<?php

declare(strict_types=1);

namespace App\Desks\Support;

use App\Actors\Support\ActorIdentity;
use App\Communication\Contracts\MemberInboxes;
use App\Desks\Models\DeskRecord;
use Illuminate\Database\Eloquent\Builder;

/**
 * An actor belongs to the inbox of every desk it sits at.
 */
final readonly class SeatedInboxes implements MemberInboxes
{
    public function inboxIdsOf(ActorIdentity $actor): Builder
    {
        return DeskRecord::query()->occupiedBy($actor)->select('inbox_id');
    }
}
