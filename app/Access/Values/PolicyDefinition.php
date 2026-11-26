<?php

declare(strict_types=1);

namespace App\Access\Values;

use App\Access\Contracts\OwnerPolicy;
use App\Access\Contracts\Policy;
use App\Access\Contracts\RecordPolicy;
use App\Access\Contracts\RestrictedPolicy;
use App\Access\Contracts\WorkspacePolicy;
use App\Agents\Enums\AccessType;
use App\Support\Reflector;

/**
 * One policy with the accesses it accepts. Which built-in agent profiles are granted each is read from the access type
 * and from what the policy class says of itself: the owner's, over the workspace, or restricted further.
 */
final readonly class PolicyDefinition
{
    /**
     * @param  class-string<Policy>  $policy
     * @param  list<AccessType>  $accesses
     */
    public function __construct(public string $policy, public array $accesses) {}

    /**
     * What a built-in agent profile is granted of this policy, in the order the policy accepts them.
     *
     * @return list<AccessType>
     */
    public function grantsForAgents(bool $isCoordinator, bool $isReadOnly): array
    {
        if (Reflector::factory()->isSubclassOf($this->policy, OwnerPolicy::class)) {
            return [];
        }

        return array_values(array_filter(
            $this->accesses,
            fn (AccessType $access) => $this->isGrantedToAgent($access, $isCoordinator, $isReadOnly),
        ));
    }

    public function supports(AccessType $access): bool
    {
        return in_array($access, $this->accesses, true);
    }

    public function isRecord(): bool
    {
        return Reflector::factory()->isSubclassOf($this->policy, RecordPolicy::class);
    }

    /**
     * @return class-string
     */
    public function model(): string
    {
        return $this->policy::model();
    }

    private function isGrantedToAgent(AccessType $access, bool $isCoordinator, bool $isReadOnly): bool
    {
        if (! $access->audience()->admitsAgent($isCoordinator, $isReadOnly)) {
            return false;
        }

        if ($isReadOnly
            && Reflector::factory()->isSubclassOf($this->policy, WorkspacePolicy::class)
            && $access->changesFiles()) {
            return false;
        }

        if (Reflector::factory()->isSubclassOf($this->policy, RestrictedPolicy::class)) {
            return $this->policy::additionalAudience($access)->admitsAgent($isCoordinator, $isReadOnly);
        }

        return true;
    }
}
