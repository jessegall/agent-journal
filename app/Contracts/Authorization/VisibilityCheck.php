<?php

declare(strict_types=1);

namespace App\Contracts\Authorization;

use App\Contracts\Actors\Actor;

/**
 * Whether an actor may see a page, a section or a navigation item; built per request by the container.
 */
interface VisibilityCheck
{
    public function allows(Actor $actor): bool;
}
