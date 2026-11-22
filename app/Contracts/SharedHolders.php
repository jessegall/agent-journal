<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Support\AssigneeIdentity;
use Illuminate\Database\Eloquent\Builder;

/**
 * The holders whose work an assignee shares, such as the desks an actor sits at: one id subquery per holder type, so
 * a held-work query never loads the holders.
 */
interface SharedHolders
{
    /**
     * @return array<string, Builder<*>>
     */
    public function sharedWith(AssigneeIdentity $member): array;
}
