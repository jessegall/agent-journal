<?php

declare(strict_types=1);

namespace App\Actors\Values;

use App\Actors\Contracts\Policy;
use App\Actors\Contracts\RecordPolicy;
use App\Actors\Exceptions\PolicyDefinitionConflict;
use App\Operations\Enums\AccessType;

/**
 * One policy with the accesses it accepts, and those the journal's built-in agent profiles never get, those only a
 * coordinating profile gets, and those a read-only profile never gets. The policy names its model.
 */
final readonly class PolicyDefinition
{
    /**
     * @param  class-string<Policy>  $policy
     * @param  list<AccessType>  $accesses
     * @param  list<AccessType>  $ownerOnly
     * @param  list<AccessType>  $coordinatorOnly
     * @param  list<AccessType>  $notForReadOnly
     *
     * @throws PolicyDefinitionConflict when a restriction names an access the policy does not accept
     */
    public function __construct(
        public string $policy,
        public array $accesses,
        public array $ownerOnly = [],
        public array $coordinatorOnly = [],
        public array $notForReadOnly = [],
    ) {
        $restrictions = [
            'owner-only' => $ownerOnly,
            'coordinator-only' => $coordinatorOnly,
            'not-for-read-only' => $notForReadOnly,
        ];

        foreach ($restrictions as $restriction => $restricted) {
            if (array_diff(self::values($restricted), self::values($accesses)) !== []) {
                throw PolicyDefinitionConflict::forRestriction($policy, $restriction);
            }
        }
    }

    /**
     * What a built-in agent profile is granted of this policy: every accepted access but the owner's, the coordinator's only for a
     * coordinating profile, and none a read-only profile may not have.
     *
     * @return list<AccessType>
     */
    public function grantsForAgents(bool $coordinator, bool $readOnly): array
    {
        $withheld = [
            ...$this->ownerOnly,
            ...($coordinator ? [] : $this->coordinatorOnly),
            ...($readOnly ? $this->notForReadOnly : []),
        ];

        return array_values(array_filter(
            $this->accesses,
            fn (AccessType $access) => ! in_array($access, $withheld, true),
        ));
    }

    public function supports(AccessType $access): bool
    {
        return in_array($access, $this->accesses, true);
    }

    public function isRecord(): bool
    {
        return is_subclass_of($this->policy, RecordPolicy::class);
    }

    /**
     * @return class-string
     */
    public function model(): string
    {
        return $this->policy::model();
    }

    /**
     * @param  list<AccessType>  $accesses
     * @return list<string>
     */
    private static function values(array $accesses): array
    {
        return array_map(fn (AccessType $access) => $access->value, $accesses);
    }
}
