<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\Actors\Contracts\CurrentActor;
use App\Agents\Enums\AccessRuleType;
use App\Agents\Values\AccessDecision;
use App\Agents\Values\Operation;
use App\Hooks\Contracts\OperationPolicy;
use App\Profiles\Values\StartProfileAuthority;

/**
 * Decides a native operation by the acting agent's pinned profile, the access its session started under; no caller
 * chooses another. An actor acting without a profile, such as the owner, is not held to one.
 */
final readonly class ProfileOperationPolicy implements OperationPolicy
{
    public function __construct(private CurrentActor $actors) {}

    public function assess(Operation $operation): AccessDecision
    {
        $authority = $this->actors->authority();

        if (! $authority instanceof StartProfileAuthority) {
            return AccessDecision::allowed(
                AccessRuleType::ClassGrant,
                'An actor without a profile is not held to one.',
            );
        }

        return $authority->profile->start->access->decide($operation);
    }
}
