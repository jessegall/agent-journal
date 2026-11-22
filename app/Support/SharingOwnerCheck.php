<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\Actor;
use App\Contracts\Authorization\VisibilityCheck;
use App\Contracts\Sharing\SharePolicy;

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
