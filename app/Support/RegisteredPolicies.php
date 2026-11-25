<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Authorization\PolicyCatalogue;
use App\Contracts\Domains\DomainAvailability;
use App\Enums\AccessType;
use App\Exceptions\GrantNotRegistered;
use App\Exceptions\PolicyDefinitionConflict;
use App\Values\PolicyDefinition;
use Illuminate\Container\Container;

/**
 * The policies registered at boot, each kept with its owner: one owner guards a model, which has at most one record
 * policy; an owner's accesses grant only while the owner is available, read for the request asking.
 */
final class RegisteredPolicies implements PolicyCatalogue
{
    /**
     * @var Registry<array{string, PolicyDefinition}>
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

    public function register(string $owner, PolicyDefinition $definition): void
    {
        $model = $definition->model();
        $modelOwner = $this->modelOwners->find($model)->getOrElse($owner);

        if ($modelOwner !== $owner) {
            throw PolicyDefinitionConflict::forModel($model, $modelOwner, $owner);
        }

        if ($this->byPolicy->has($definition->policy)) {
            [$policyOwner] = $this->byPolicy->get($definition->policy);

            throw PolicyDefinitionConflict::forPolicy($definition->policy, $policyOwner, $owner);
        }

        if ($definition->isRecord() && $this->recordPolicies->has($model)) {
            $recordPolicy = $this->recordPolicies->get($model);

            throw PolicyDefinitionConflict::forRecordPolicy($model, $recordPolicy, $definition->policy);
        }

        $this->modelOwners->put($model, $owner);
        $this->byPolicy->put($definition->policy, [
            $owner,
            $definition,
        ]);

        if ($definition->isRecord()) {
            $this->recordPolicies->put($model, $definition->policy);
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

    public function definitionOf(string $policy): PolicyDefinition
    {
        return $this->byPolicy->get($policy)[1];
    }

    public function definitions(): array
    {
        return array_values(array_map(fn (array $entry): PolicyDefinition => $entry[1], $this->byPolicy->all()));
    }

    public function grantable(): array
    {
        $availability = Container::getInstance()->make(DomainAvailability::class);

        $grantable = array_filter(
            $this->byPolicy->all(),
            fn (array $entry): bool => $availability->isEnabled($entry[0]),
        );

        return array_values(array_map(fn (array $entry): PolicyDefinition => $entry[1], $grantable));
    }

    /**
     * @return array{string, PolicyDefinition}
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
