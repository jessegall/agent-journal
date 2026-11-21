<?php

declare(strict_types=1);

namespace App\Actors\Values;

use App\Actors\Contracts\OwnerPolicy;
use App\Actors\Contracts\Policy;
use App\Actors\Contracts\RecordPolicy;
use App\Actors\Contracts\RestrictedPolicy;
use App\Actors\Contracts\WorkspacePolicy;
use App\Operations\Enums\AccessType;
use App\Reflection\Support\Reflector;

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
    public function grantsForAgents(bool $coordinator, bool $readOnly): array
    {
        if (Reflector::factory()->isSubclassOf($this->policy, OwnerPolicy::class)) {
            return [];
        }

        return array_values(array_filter(
            $this->accesses,
            fn (AccessType $access) => $this->isGrantedToAgent($access, $coordinator, $readOnly),
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

    private function isGrantedToAgent(AccessType $access, bool $coordinator, bool $readOnly): bool
    {
        if (! $access->audience()->admitsAgent($coordinator, $readOnly)) {
            return false;
        }

        if ($readOnly
            && Reflector::factory()->isSubclassOf($this->policy, WorkspacePolicy::class)
            && $access->changesFiles()) {
            return false;
        }

        if (Reflector::factory()->isSubclassOf($this->policy, RestrictedPolicy::class)) {
            return $this->policy::additionalAudience($access)->admitsAgent($coordinator, $readOnly);
        }

        return true;
    }
}
