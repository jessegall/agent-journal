<?php

declare(strict_types=1);

namespace App\Assignments\Registry;

use App\Actors\Enums\ActorType;
use App\Assignments\Contracts\Assignable;
use App\Assignments\Contracts\AssignableProvider;
use App\Assignments\Contracts\AssignedWorkProvider;
use App\Assignments\Contracts\AssigneeProvider;
use App\Assignments\Contracts\AssignmentPoolFactory;
use App\Assignments\Contracts\AssignmentProviders;
use App\Assignments\Contracts\AssignmentRegistration;
use App\Assignments\Contracts\AutoAssigner;
use App\Assignments\Contracts\AutoAssignmentActivity;
use App\Assignments\Enums\AssignmentPurpose;
use App\Assignments\Exceptions\AssigneeTypeRepeated;
use App\Assignments\Exceptions\AssignmentProviderInvalid;
use App\Assignments\Exceptions\AssignmentTypeInternal;
use App\Assignments\Exceptions\AssignmentTypeRepeated;
use App\Assignments\Exceptions\AssignmentTypeUnavailable;
use App\Assignments\Exceptions\AutoAssignmentDeclarationRefused;
use App\Assignments\Support\ActivityRegistration;
use App\Assignments\Support\AssigneeRegistration;
use App\Assignments\Support\AutoAssignerDefinition;
use App\Assignments\Support\PoolDefinition;
use App\Links\Support\LinkTypeRegistry;
use App\Records\Support\RecordIdentity;
use Illuminate\Contracts\Container\Container;

/**
 * Which provider answers for each assignable record type and each type of actor that can hold records, and the
 * auto-assigners and pools each owner declares. It keeps class names and declarations only and builds a provider when
 * one is asked for, so a provider that holds the request's actor is never kept beyond its request.
 */
final class AssignmentRegistry implements AssignmentProviders, AssignmentRegistration
{
    /**
     * The domains each registered owner requires, by owner name.
     *
     * @var array<string, list<string>>
     */
    private array $owners = [];

    /**
     * @var array<string, class-string<AssignableProvider>>
     */
    private array $recordProviders = [];

    /**
     * @var array<string, string>
     */
    private array $recordOwners = [];

    /**
     * @var array<string, AssignmentPurpose>
     */
    private array $recordPurposes = [];

    /**
     * @var array<string, AutoAssignerDefinition>
     */
    private array $autoAssigners = [];

    /**
     * @var array<string, PoolDefinition>
     */
    private array $pools = [];

    /**
     * @var array<string, string>
     */
    private array $poolOwners = [];

    /**
     * @var array<string, class-string<AssigneeProvider>>
     */
    private array $assigneeProviders = [];

    /**
     * @var array<string, class-string<AutoAssignmentActivity>>
     */
    private array $activities = [];

    public function __construct(private readonly Container $container) {}

    /**
     * @throws AutoAssignmentDeclarationRefused
     */
    public function registerOwner(string $owner, array $requires): void
    {
        if (array_key_exists($owner, $this->owners)) {
            throw AutoAssignmentDeclarationRefused::ownerRepeated($owner);
        }

        $this->owners[$owner] = $requires;
    }

    /**
     * @throws AssignmentTypeRepeated
     * @throws AssignmentProviderInvalid
     * @throws AutoAssignmentDeclarationRefused
     */
    public function registerRecord(
        string $type,
        string $providerClass,
        string $owner,
        AssignmentPurpose $purpose,
    ): void {
        RecordIdentity::checkType($type);
        $this->requireOwner($owner);

        if (array_key_exists($type, $this->recordProviders)) {
            throw AssignmentTypeRepeated::for($type);
        }

        if (! is_subclass_of($providerClass, AssignableProvider::class)) {
            throw AssignmentProviderInvalid::forRecords($type, $providerClass);
        }

        $this->recordProviders[$type] = $providerClass;
        $this->recordOwners[$type] = $owner;
        $this->recordPurposes[$type] = $purpose;
    }

    /**
     * Refused unless the owner registered the record type itself, earlier in its own boot.
     *
     * @throws AssignmentProviderInvalid
     * @throws AutoAssignmentDeclarationRefused
     */
    public function registerAutoAssigner(AutoAssignerDefinition $definition, string $owner): void
    {
        $this->requireOwner($owner);
        $type = $definition->type;
        $assignerClass = $definition->assignerClass;
        $workProviderClass = $definition->workProviderClass;

        if (array_key_exists($type, $this->autoAssigners)) {
            throw AutoAssignmentDeclarationRefused::assignerRepeated($type);
        }

        if (! array_key_exists($type, $this->recordOwners)) {
            throw AutoAssignmentDeclarationRefused::typeNotAssignable($type, $owner);
        }

        if ($this->recordOwners[$type] !== $owner) {
            throw AutoAssignmentDeclarationRefused::assignerOfAnotherOwner($type, $owner, $this->recordOwners[$type]);
        }

        if (! is_subclass_of($assignerClass, AutoAssigner::class)) {
            throw AssignmentProviderInvalid::forAutoAssigner($type, $assignerClass);
        }

        if (! is_subclass_of($workProviderClass, AssignedWorkProvider::class)) {
            throw AssignmentProviderInvalid::forAssignedWork($type, $workProviderClass);
        }

        $this->autoAssigners[$type] = new AutoAssignerDefinition($type, $assignerClass, $workProviderClass);
    }

    /**
     * Whether the pool's type is assignable and its owner may use that type is checked by checkPools once every owner
     * has registered, since owners boot in the order they are listed.
     *
     * @throws AssignmentProviderInvalid
     * @throws AutoAssignmentDeclarationRefused
     */
    public function registerPool(PoolDefinition $pool, string $owner): void
    {
        $this->requireOwner($owner);

        if (array_key_exists($pool->key, $this->pools)) {
            throw AutoAssignmentDeclarationRefused::poolRepeated($pool->key);
        }

        if (! is_subclass_of($pool->factoryClass, AssignmentPoolFactory::class)) {
            throw AssignmentProviderInvalid::forPoolFactory($pool->key, $pool->factoryClass);
        }

        $this->pools[$pool->key] = $pool;
        $this->poolOwners[$pool->key] = $owner;
    }

    /**
     * @throws AssigneeTypeRepeated
     * @throws AssignmentProviderInvalid
     */
    public function registerAssignees(AssigneeRegistration $registration): void
    {
        if (array_key_exists($registration->type, $this->assigneeProviders)) {
            throw AssigneeTypeRepeated::for($registration->type);
        }

        if (! is_subclass_of($registration->providerClass, AssigneeProvider::class)) {
            throw AssignmentProviderInvalid::forAssignees($registration->type, $registration->providerClass);
        }

        $this->assigneeProviders[$registration->type] = $registration->providerClass;
    }

    /**
     * @throws AssigneeTypeRepeated
     * @throws AssignmentProviderInvalid
     */
    public function registerActivity(ActivityRegistration $registration): void
    {
        $type = $registration->type->value;

        if (array_key_exists($type, $this->activities)) {
            throw AssigneeTypeRepeated::for($type);
        }

        if (! is_subclass_of($registration->activityClass, AutoAssignmentActivity::class)) {
            throw AssignmentProviderInvalid::forActivity($type, $registration->activityClass);
        }

        $this->activities[$type] = $registration->activityClass;
    }

    public function requirePublic(string $type): void
    {
        if (! $this->purposeOf($type)->isPublic()) {
            throw AssignmentTypeInternal::forType($type);
        }
    }

    public function requireInternal(string $type): void
    {
        if ($this->purposeOf($type)->isPublic()) {
            throw AssignmentTypeUnavailable::forType($type);
        }
    }

    public function hasRecordProvider(string $type): bool
    {
        return isset($this->recordProviders[$type]);
    }

    /**
     * @throws AssignmentTypeUnavailable
     * @throws AssignmentProviderInvalid
     */
    public function recordProvider(string $type): AssignableProvider
    {
        $providerClass = $this->recordProviders[$type] ?? throw AssignmentTypeUnavailable::forType($type);

        return $this->build($providerClass, AssignableProvider::class);
    }

    /**
     * @throws AssignmentTypeUnavailable
     * @throws AssignmentProviderInvalid
     */
    public function assigneeProvider(string $type): AssigneeProvider
    {
        $providerClass = $this->assigneeProviders[$type] ?? throw AssignmentTypeUnavailable::forType($type);

        return $this->build($providerClass, AssigneeProvider::class);
    }

    /**
     * @throws AssignmentTypeUnavailable
     * @throws AssignmentProviderInvalid
     */
    public function activity(ActorType $type): AutoAssignmentActivity
    {
        $activityClass = $this->activities[$type->value] ?? throw AssignmentTypeUnavailable::forActorType($type);

        return $this->build($activityClass, AutoAssignmentActivity::class);
    }

    /**
     * @throws AssignmentTypeUnavailable
     * @throws AssignmentProviderInvalid
     */
    public function autoAssigner(string $type): AutoAssigner
    {
        return $this->build($this->autoAssignerDefinition($type)->assignerClass, AutoAssigner::class);
    }

    /**
     * @throws AssignmentTypeUnavailable
     * @throws AssignmentProviderInvalid
     */
    public function assignedWork(string $type): AssignedWorkProvider
    {
        return $this->build($this->autoAssignerDefinition($type)->workProviderClass, AssignedWorkProvider::class);
    }

    /**
     * @throws AssignmentTypeUnavailable
     * @throws AssignmentProviderInvalid
     */
    public function poolFactory(string $key): AssignmentPoolFactory
    {
        $pool = $this->pools[$key] ?? throw AssignmentTypeUnavailable::forPool($key);

        return $this->build($pool->factoryClass, AssignmentPoolFactory::class);
    }

    /**
     * @throws AssignmentTypeUnavailable
     */
    public function recordOwner(string $type): string
    {
        return $this->recordOwners[$type] ?? throw AssignmentTypeUnavailable::forType($type);
    }

    /**
     * @throws AssignmentTypeUnavailable
     */
    public function poolOwner(string $key): string
    {
        return $this->poolOwners[$key] ?? throw AssignmentTypeUnavailable::forPool($key);
    }

    public function pools(string $type): array
    {
        return array_values(array_filter($this->pools, fn (PoolDefinition $pool) => $pool->assignableType === $type));
    }

    /**
     * Every registered record type is a link alias whose model is Assignable. Run once every owner has registered its
     * aliases, after the application booted.
     *
     * @throws AssignmentProviderInvalid
     */
    public function checkRecordModels(LinkTypeRegistry $links): void
    {
        foreach (array_keys($this->recordProviders) as $type) {
            $model = $links->modelFor($type);

            if (! is_subclass_of($model, Assignable::class)) {
                throw AssignmentProviderInvalid::forModel($type, $model);
            }
        }
    }

    /**
     * Every pool holds an assignable type whose owner is the pool's owner or a domain the pool's owner requires. Run
     * once every owner has registered, after the application booted.
     *
     * @throws AutoAssignmentDeclarationRefused
     */
    public function checkPools(): void
    {
        foreach ($this->pools as $key => $pool) {
            $owner = $this->poolOwners[$key];
            $recordOwner = $this->recordOwners[$pool->assignableType]
                ?? throw AutoAssignmentDeclarationRefused::typeNotAssignable($pool->assignableType, $owner);

            if ($recordOwner !== $owner && ! in_array($recordOwner, $this->owners[$owner], true)) {
                throw AutoAssignmentDeclarationRefused::poolOfUnrelatedOwner($key, $owner, $recordOwner);
            }
        }
    }

    /**
     * @throws AutoAssignmentDeclarationRefused
     */
    private function requireOwner(string $owner): void
    {
        if (! array_key_exists($owner, $this->owners)) {
            throw AutoAssignmentDeclarationRefused::ownerUnknown($owner);
        }
    }

    /**
     * @throws AssignmentTypeUnavailable
     */
    private function autoAssignerDefinition(string $type): AutoAssignerDefinition
    {
        return $this->autoAssigners[$type] ?? throw AssignmentTypeUnavailable::forAutoAssignment($type);
    }

    /**
     * Builds the registered class through the container, so a rebound class is the one built, and refuses what does
     * not implement the contract.
     *
     * @template T of object
     *
     * @param  class-string  $registeredClass
     * @param  class-string<T>  $contract
     * @return T
     *
     * @throws AssignmentProviderInvalid
     */
    private function build(string $registeredClass, string $contract): object
    {
        $built = $this->container->make($registeredClass);

        if (! $built instanceof $contract) {
            throw AssignmentProviderInvalid::forResolved($registeredClass, $built::class, $contract);
        }

        return $built;
    }

    /**
     * @throws AssignmentTypeUnavailable
     */
    private function purposeOf(string $type): AssignmentPurpose
    {
        return $this->recordPurposes[$type] ?? throw AssignmentTypeUnavailable::forType($type);
    }
}
