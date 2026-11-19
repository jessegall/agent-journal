<?php

declare(strict_types=1);

namespace App\Profiles\Values;

use App\Actors\Contracts\Policy;
use BackedEnum;

/**
 * One ability a profile grants: a policy and one of its ability cases. The pair is the identity, so the finish of
 * tasks and the finish of another domain never collide.
 */
final readonly class AbilityGrant
{
    /**
     * @param  class-string<Policy>  $policy
     */
    public function __construct(public string $policy, public BackedEnum $ability) {}

    /**
     * @param  class-string<Policy>  $policy
     */
    public function isFor(string $policy, BackedEnum $ability): bool
    {
        return $this->policy === $policy && $this->ability === $ability;
    }

    /**
     * @return array{policy: class-string<Policy>, ability_type: class-string<BackedEnum>, ability: int|string}
     */
    public function toArray(): array
    {
        return ['policy' => $this->policy, 'ability_type' => $this->ability::class, 'ability' => $this->ability->value];
    }

    /**
     * @param  array{policy: class-string<Policy>, ability_type: class-string<BackedEnum>, ability: int|string}  $fields
     */
    public static function fromArray(array $fields): self
    {
        return new self($fields['policy'], $fields['ability_type']::from($fields['ability']));
    }
}
