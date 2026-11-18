<?php

declare(strict_types=1);

namespace App\Sharing\Support;

use App\Actors\Contracts\Actor;
use App\Sharing\Contracts\SharePolicy;
use App\Ui\Contracts\VisibilityCheck;

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
