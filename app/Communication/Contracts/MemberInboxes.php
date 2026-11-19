<?php

declare(strict_types=1);

namespace App\Communication\Contracts;

use App\Actors\Support\ActorIdentity;
use Illuminate\Database\Eloquent\Builder;

/**
 * The inboxes an actor belongs to now, as one id subquery, so a message query never loads the memberships.
 */
interface MemberInboxes
{
    /**
     * @return Builder<*>
     */
    public function inboxIdsOf(ActorIdentity $actor): Builder;
}
