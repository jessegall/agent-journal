<?php

declare(strict_types=1);

namespace App\Sharing\Support;

use App\Access\Contracts\SharePolicy;
use App\Actors\Contracts\Actor;
use App\Models\Sharing\Share;
use PhpOption\None;
use PhpOption\Option;

/**
 * Reads the public address of a share for the owner who granted it, while that owner is still the configured owner
 * and the share is active and unexpired; anyone else, or any other share, gets nothing.
 */
final readonly class ShareLinkResolver
{
    public function __construct(private SharePolicy $policy) {}

    /**
     * @return Option<string>
     */
    public function linkFor(Actor $resolver, string $shareId): Option
    {
        if (! $this->policy->mayManage($resolver)) {
            return None::create();
        }

        return Share::findGrantedBy($resolver->actorId(), $shareId)->flatMap(fn (Share $share) => $share->ownerUrl());
    }
}
