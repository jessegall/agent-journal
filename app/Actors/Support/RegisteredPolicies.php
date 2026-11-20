<?php

declare(strict_types=1);

namespace App\Actors\Support;

use App\Actors\Contracts\PolicyCatalogue;
use App\Actors\Exceptions\GrantNotRegistered;
use App\Actors\Exceptions\PolicyRegistrationConflict;
use App\Actors\Values\PolicyRegistration;
use App\Contracts\DomainAvailability;
use App\Operations\Enums\AccessType;
use App\Registries\Support\Registry;
use Illuminate\Container\Container;

/**
 * The policies registered at boot, each kept with its owner: one owner guards a model, which has at most one record
 * policy; an owner's accesses grant only while the owner is available, read for the request asking.
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

    /**
     * @var Registry<string>
     */
    private readonly Registry $recordPolicies;

    public function __construct()
    {
        $this->byPolicy = Registry::replacing(GrantNotRegistered::forPolicy(...));
        $this->modelOwners = Registry::replacing(GrantNotRegistered::forModel(...));
        $this->recordPolicies = Registry::replacing(GrantNotRegistered::forModel(...));
    }

    public function register(string $owner, PolicyRegistration $registration): void
    {
        $model = $registration->model();
        $modelOwner = $this->modelOwners->find($model)->getOrElse($owner);

        if ($modelOwner !== $owner) {
            throw PolicyRegistrationConflict::forModel($model, $modelOwner, $owner);
        }

        if ($this->byPolicy->has($registration->policy)) {
            [$policyOwner] = $this->byPolicy->get($registration->policy);

            throw PolicyRegistrationConflict::forPolicy($registration->policy, $policyOwner, $owner);
        }

        if ($registration->isRecord() && $this->recordPolicies->has($model)) {
            $recordPolicy = $this->recordPolicies->get($model);

            throw PolicyRegistrationConflict::forRecordPolicy($model, $recordPolicy, $registration->policy);
        }

        $this->modelOwners->put($model, $owner);
        $this->byPolicy->put($registration->policy, [$owner, $registration]);

        if ($registration->isRecord()) {
            $this->recordPolicies->put($model, $registration->policy);
        }
    }

    public function assertSupported(string $policy, AccessType $access): void
    {
        $this->supportedEntry($policy, $access);
    }

    public function assertGrantable(string $policy, AccessType $access): void
    {
        [$owner] = $this->supportedEntry($policy, $access);

        if (! Container::getInstance()->make(DomainAvailability::class)->isEnabled($owner)) {
            throw GrantNotRegistered::for($policy, $access);
        }
    }

    public function registrationOf(string $policy): PolicyRegistration
    {
        return $this->byPolicy->get($policy)[1];
    }

    public function registrations(): array
    {
        return array_values(array_map(fn (array $entry): PolicyRegistration => $entry[1], $this->byPolicy->all()));
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

    /**
     * @return array{string, PolicyRegistration}
     *
     * @throws GrantNotRegistered
     */
    private function supportedEntry(string $policy, AccessType $access): array
    {
        $refusal = GrantNotRegistered::for($policy, $access);
        $entry = $this->byPolicy->find($policy)->getOrThrow($refusal);

        if (! $entry[1]->supports($access)) {
            throw $refusal;
        }

        return $entry;
    }
}
