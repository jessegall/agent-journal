<?php

declare(strict_types=1);

namespace App\Actors\Support;

use App\Actors\Contracts\PolicyCatalogue;
use App\Actors\Exceptions\AbilityNotRegistered;
use App\Actors\Exceptions\PolicyRegistrationConflict;
use App\Actors\Values\PolicyRegistration;
use App\Contracts\DomainAvailability;
use BackedEnum;
use Illuminate\Contracts\Auth\Access\Gate;
use Illuminate\Contracts\Container\Container;

/**
 * The policies registered at boot, each kept with its owner and handed to Laravel's Gate for its model; an owner's
 * abilities grant only while the owner is available, read for the request asking.
 */
final class RegisteredPolicies implements PolicyCatalogue
{
    /**
     * @var array<string, array{string, PolicyRegistration}>
     */
    private array $byPolicy = [];

    /**
     * @var array<string, string>
     */
    private array $modelOwners = [];

    public function __construct(private readonly Gate $gate, private readonly Container $container) {}

    public function register(string $owner, PolicyRegistration $registration): void
    {
        $modelOwner = $this->modelOwners[$registration->model] ?? null;
        $policyOwner = $this->byPolicy[$registration->policy][0] ?? null;

        if ($modelOwner !== null) {
            throw PolicyRegistrationConflict::forModel($registration->model, $modelOwner, $owner);
        }

        if ($policyOwner !== null) {
            throw PolicyRegistrationConflict::forPolicy($registration->policy, $policyOwner, $owner);
        }

        $this->modelOwners[$registration->model] = $owner;
        $this->byPolicy[$registration->policy] = [$owner, $registration];
        $this->gate->policy($registration->model, $registration->policy);
    }

    public function requireGrantable(string $policy, BackedEnum $ability): void
    {
        [$owner, $registration] = $this->byPolicy[$policy] ?? throw AbilityNotRegistered::for($policy, $ability);
        $available = $this->container->make(DomainAvailability::class)->isEnabled($owner);

        if (! $registration->grants($ability) || ! $available) {
            throw AbilityNotRegistered::for($policy, $ability);
        }
    }

    public function grantable(): array
    {
        $availability = $this->container->make(DomainAvailability::class);
        $grantable = array_filter($this->byPolicy, fn (array $entry): bool => $availability->isEnabled($entry[0]));

        return array_values(array_map(fn (array $entry): PolicyRegistration => $entry[1], $grantable));
    }
}
