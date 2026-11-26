<?php

declare(strict_types=1);

namespace App\Sharing\Support;

use App\Access\Contracts\SharePolicy;
use App\Access\Contracts\VisibilityCheck;
use App\Actors\Contracts\Actor;

/**
 * Shows the sharing pages and their actions to the current configured owner only.
 */
final readonly class SharingOwnerCheck implements VisibilityCheck
{
    public function __construct(private SharePolicy $policy) {}

    public function allows(Actor $actor): bool
    {
        return $this->policy->mayManage($actor);
    }
}
