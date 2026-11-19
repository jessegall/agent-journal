<?php

declare(strict_types=1);

namespace App\Profiles\Values;

use App\Actors\Contracts\Authorizer;
use App\Actors\Contracts\Policy;
use App\Actors\Contracts\PolicyCatalogue;
use App\Actors\Exceptions\AbilityNotRegistered;
use App\Actors\Exceptions\ActorNotAllowed;
use App\Profiles\Enums\AuthorizationType;
use BackedEnum;

/**
 * A profile's authorization: its strategy and the abilities it grants. An ability its grants do not name is never
 * granted, an undeclared one included.
 */
final readonly class ProfileAuthorization
{
    /**
     * @param  list<AbilityGrant>  $grants
     */
    public function __construct(public AuthorizationType $type, public array $grants) {}

    /**
     * @param  class-string<Policy>  $policy
     *
     * @throws ActorNotAllowed
     */
    public function requireGranted(string $policy, BackedEnum $ability): void
    {
        if (! array_any($this->grants, fn (AbilityGrant $grant): bool => $grant->isFor($policy, $ability))) {
            throw ActorNotAllowed::to($ability, 'record');
        }
    }

    /**
     * Refuses a grant that names an ability no available policy grants.
     *
     * @throws AbilityNotRegistered
     */
    public function requireGrantableIn(PolicyCatalogue $catalogue): void
    {
        foreach ($this->grants as $grant) {
            $catalogue->requireGrantable($grant->policy, $grant->ability);
        }
    }

    /**
     * The authorizer this profile's strategy gives it.
     */
    public function authorizer(PolicyCatalogue $catalogue): Authorizer
    {
        return $this->type->authorizerFor($this, $catalogue);
    }

    /**
     * @return list<array{policy: class-string<Policy>, ability_type: class-string<BackedEnum>, ability: int|string}>
     */
    public function grantsAsArrays(): array
    {
        return array_map(fn (AbilityGrant $grant) => $grant->toArray(), $this->grants);
    }
}
