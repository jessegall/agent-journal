<?php

declare(strict_types=1);

namespace App\Actors\Values;

use App\Actors\Contracts\Policy;
use App\Actors\Enums\ReadEntitlementType;
use App\Operations\Enums\AccessType;
use Closure;

/**
 * What one read needs from the caller's profile, declared once by the module that owns the read.
 */
final readonly class ReadEntitlement
{
    /**
     * @param  class-string<Policy>|null  $policy
     */
    private function __construct(
        public ReadEntitlementType $type,
        public string|null $policy,
        public AccessType|null $access,
    ) {}

    /**
     * A model read: the profile must hold this policy's access.
     *
     * @param  class-string<Policy>  $policy
     */
    public static function grant(string $policy, AccessType $access = AccessType::Read): self
    {
        return new self(ReadEntitlementType::Grant, $policy, $access);
    }

    /**
     * An orientation or scoped read: the profile must hold the read by name, for the target when one is named.
     */
    public static function named(): self
    {
        return new self(ReadEntitlementType::Named, null, null);
    }

    /**
     * A read whose own resolver checks every record it shows.
     */
    public static function resolver(): self
    {
        return new self(ReadEntitlementType::Resolver, null, null);
    }

    /**
     * Whether a profile holding these pairs holds the read's grant.
     *
     * @param  Closure(class-string<Policy>, AccessType): bool  $grants
     */
    public function isGrantedBy(Closure $grants): bool
    {
        return $this->policy !== null && $this->access !== null && $grants($this->policy, $this->access);
    }
}
