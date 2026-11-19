<?php

declare(strict_types=1);

namespace App\Actors\Support;

use App\Actors\Contracts\PolicyCatalogue;
use App\Actors\Exceptions\AbilityNotRegistered;
use App\Actors\Exceptions\PolicyRegistrationConflict;
use App\Actors\Values\PolicyRegistration;
use App\Contracts\DomainAvailability;
use App\Registries\Support\Registry;
use BackedEnum;
use Illuminate\Container\Container;
use Illuminate\Contracts\Auth\Access\Gate;

/**
 * The policies registered at boot, each kept with its owner and handed to Laravel's Gate for its model; an owner's
 * abilities grant only while the owner is available, read for the request asking.
 */
final class RegisteredPolicies implements PolicyCatalogue
{
    /**
     * @var Registry<array{string, PolicyRegistration}>
     */
    private readonly Registry $byPolicy;

    /**
     * @var Registry<string>
     */
    private readonly Registry $modelOwners;

    public function __construct(private readonly Gate $gate)
    {
        $this->byPolicy = Registry::replacing(AbilityNotRegistered::forPolicy(...));
        $this->modelOwners = Registry::replacing(AbilityNotRegistered::forModel(...));
    }

    public function register(string $owner, PolicyRegistration $registration): void
    {
        if ($this->modelOwners->has($registration->model)) {
            $modelOwner = $this->modelOwners->get($registration->model);

            throw PolicyRegistrationConflict::forModel($registration->model, $modelOwner, $owner);
        }

        if ($this->byPolicy->has($registration->policy)) {
            [$policyOwner] = $this->byPolicy->get($registration->policy);

            throw PolicyRegistrationConflict::forPolicy($registration->policy, $policyOwner, $owner);
        }

        $this->modelOwners->put($registration->model, $owner);
        $this->byPolicy->put($registration->policy, [$owner, $registration]);
        $this->gate->policy($registration->model, $registration->policy);
    }

    public function requireGrantable(string $policy, BackedEnum $ability): void
    {
        $refusal = AbilityNotRegistered::for($policy, $ability);
        [$owner, $registration] = $this->byPolicy->find($policy)->getOrThrow($refusal);
        $available = Container::getInstance()->make(DomainAvailability::class)->isEnabled($owner);

        if (! $registration->grants($ability) || ! $available) {
            throw $refusal;
        }
    }

    public function grantable(): array
    {
        $availability = Container::getInstance()->make(DomainAvailability::class);
        $grantable = array_filter(
            $this->byPolicy->all(),
            fn (array $entry): bool => $availability->isEnabled($entry[0]),
        );

        return array_values(array_map(fn (array $entry): PolicyRegistration => $entry[1], $grantable));
    }
}
