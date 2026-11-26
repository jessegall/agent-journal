<?php

declare(strict_types=1);

namespace App\Access\Contracts;

use App\Actors\Contracts\Actor;

/**
 * Whether an actor may see a page, a section or a navigation item; built per request by the container.
 */
interface VisibilityCheck
{
    /**
     * Whether the actor may see the thing this check guards.
     */
    public function allows(Actor $actor): bool;
}
