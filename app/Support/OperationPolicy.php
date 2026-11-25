<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\CurrentActor;
use App\Contracts\Authorization\OperationPolicy as OperationPolicyContract;
use App\Enums\Profiles\AccessRuleType;
use App\Values\AccessDecision;
use App\Values\AgentText;
use App\Values\Operation;
use App\Values\StartProfileAuthority;

/**
 * Decides a native operation by the acting agent's pinned profile, the access its session started under; no caller
 * chooses another. An actor acting without a profile, such as the owner, is not held to one.
 */
final readonly class OperationPolicy implements OperationPolicyContract
{
    public function __construct(private CurrentActor $actors) {}

    public function assess(Operation $operation): AccessDecision
    {
        $authority = $this->actors->authority();

        if (! $authority instanceof StartProfileAuthority) {
            return AccessDecision::allowed(
                AccessRuleType::ScopeGrant,
                AgentText::of('core.access.no_profile'),
            );
        }

        return $authority->profile->start->access->decide($operation);
    }
}
