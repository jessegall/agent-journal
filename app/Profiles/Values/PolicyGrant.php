<?php

declare(strict_types=1);

namespace App\Profiles\Values;

use App\Actors\Contracts\Policy;
use App\Operations\Enums\AccessType;
use App\Profiles\Exceptions\GrantShapeInvalid;
use App\Reflection\Support\Reflector;

/**
 * One access a profile grants on one policy. The pair is the identity, and a stored grant is exactly its two keys.
 */
final readonly class PolicyGrant
{
    /**
     * @param  class-string<Policy>  $policy
     */
    public function __construct(public string $policy, public AccessType $access) {}

    /**
     * @param  class-string<Policy>  $policy
     */
    public function isFor(string $policy, AccessType $access): bool
    {
        return $this->policy === $policy && $this->access === $access;
    }

    /**
     * @return array{policy: class-string<Policy>, access: string}
     */
    public function toArray(): array
    {
        return ['policy' => $this->policy, 'access' => $this->access->value];
    }

    /**
     * @param  array<string, mixed>  $fields
     *
     * @throws GrantShapeInvalid when the fields are not exactly a policy class and an access
     */
    public static function fromArray(array $fields): self
    {
        $keys = array_keys($fields);
        sort($keys);
        $access = is_string($fields['access'] ?? null) ? AccessType::tryFrom($fields['access']) : null;
        $policy = $fields['policy'] ?? null;

        if ($keys !== ['access', 'policy'] || $access === null || ! is_string($policy)
            || ! Reflector::isNameSubclassOf($policy, Policy::class)) {
            throw GrantShapeInvalid::for($keys);
        }

        return new self($policy, $access);
    }
}
