<?php

declare(strict_types=1);

namespace App\Support\Registry;

use App\Contracts\Assignable;
use App\Contracts\AssignableProvider;
use App\Contracts\AssignedWorkProvider;
use App\Contracts\AssigneeProvider;
use App\Contracts\AssignmentPoolFactory;
use App\Contracts\AssignmentProviders;
use App\Contracts\AssignmentRegistration;
use App\Contracts\AutoAssigner;
use App\Contracts\AutoAssignmentActivity;
use App\Contracts\JournalAssignableProvider;
use App\Enums\ActorType;
use App\Enums\AssignmentPurpose;
use App\Exceptions\AssigneeTypeRepeated;
use App\Exceptions\AssignmentProviderInvalid;
use App\Exceptions\AssignmentTypeInternal;
use App\Exceptions\AssignmentTypeRepeated;
use App\Exceptions\AssignmentTypeUnavailable;
use App\Exceptions\AutoAssignmentDeclarationRefused;
use App\Support\ActivityDefinition;
use App\Support\AssigneeDefinition;
use App\Support\AutoAssignerDefinition;
use App\Support\LinkTypeRegistry;
use App\Support\PoolDefinition;
use App\Support\RecordIdentity;
use App\Support\Reflector;
use App\Support\Registry;
use Illuminate\Container\Container;

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
     * @var Registry<list<string>>
     */
    private readonly Registry $owners;

    /**
     * @var Registry<class-string<AssignableProvider>>
     */
    private readonly Registry $recordProviders;

    /**
     * @var Registry<string>
     */
    private readonly Registry $recordOwners;

    /**
     * @var Registry<AssignmentPurpose>
     */
    private readonly Registry $recordPurposes;

    /**
     * @var Registry<AutoAssignerDefinition>
     */
    private readonly Registry $autoAssigners;

    /**
     * @var Registry<PoolDefinition>
     */
    private readonly Registry $pools;

    /**
     * @var Registry<string>
     */
    private readonly Registry $poolOwners;

    /**
     * @var Registry<class-string<AssigneeProvider>>
     */
    private readonly Registry $assigneeProviders;

    /**
     * @var Registry<class-string<AutoAssignmentActivity>>
     */
    private readonly Registry $activities;

    public function __construct()
    {
        $this->owners = Registry::once(
            AutoAssignmentDeclarationRefused::ownerUnknown(...),
            AutoAssignmentDeclarationRefused::ownerRepeated(...),
        );

        $this->recordProviders = Registry::once(
            AssignmentTypeUnavailable::forType(...),
            AssignmentTypeRepeated::for(...),
        );

        $this->recordOwners = Registry::replacing(AssignmentTypeUnavailable::forType(...));
        $this->recordPurposes = Registry::replacing(AssignmentTypeUnavailable::forType(...));

        $this->autoAssigners = Registry::once(
            AssignmentTypeUnavailable::forAutoAssignment(...),
            AutoAssignmentDeclarationRefused::assignerRepeated(...),
        );

        $this->pools = Registry::once(
            AssignmentTypeUnavailable::forPool(...),
            AutoAssignmentDeclarationRefused::poolRepeated(...),
        );

        $this->poolOwners = Registry::replacing(AssignmentTypeUnavailable::forPool(...));

        $this->assigneeProviders = Registry::once(
            AssignmentTypeUnavailable::forType(...),
            AssigneeTypeRepeated::for(...),
        );

        $this->activities = Registry::once(
            fn (string $type) => AssignmentTypeUnavailable::forActorType(ActorType::from($type)),
            AssigneeTypeRepeated::for(...),
        );
    }

    /**
     * @throws AutoAssignmentDeclarationRefused
     */
    public function registerOwner(string $owner, array $requires): void
    {
        $this->owners->put($owner, $requires);
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
        RecordIdentity::assertKnownType($type);
        $this->requireOwner($owner);

        if (! Reflector::factory()->isSubclassOf($providerClass, AssignableProvider::class)) {
            throw AssignmentProviderInvalid::forRecords($type, $providerClass);
        }

        if ($purpose === AssignmentPurpose::JournalAssigned
            && ! Reflector::factory()->isSubclassOf($providerClass, JournalAssignableProvider::class)) {
            throw AssignmentProviderInvalid::forRecords($type, $providerClass);
        }

        $this->recordProviders->put($type, $providerClass);
        $this->recordOwners->put($type, $owner);
        $this->recordPurposes->put($type, $purpose);
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

        $recordOwner = $this->recordOwners->find($type)
            ->getOrThrow(AutoAssignmentDeclarationRefused::typeNotAssignable($type, $owner));

        if ($recordOwner !== $owner) {
            throw AutoAssignmentDeclarationRefused::assignerOfAnotherOwner($type, $owner, $recordOwner);
        }

        if (! Reflector::factory()->isSubclassOf($assignerClass, AutoAssigner::class)) {
            throw AssignmentProviderInvalid::forAutoAssigner($type, $assignerClass);
        }

        if (! Reflector::factory()->isSubclassOf($workProviderClass, AssignedWorkProvider::class)) {
            throw AssignmentProviderInvalid::forAssignedWork($type, $workProviderClass);
        }

        $this->autoAssigners->put($type, new AutoAssignerDefinition($type, $assignerClass, $workProviderClass));
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

        if (! Reflector::factory()->isSubclassOf($pool->factoryClass, AssignmentPoolFactory::class)) {
            throw AssignmentProviderInvalid::forPoolFactory($pool->key, $pool->factoryClass);
        }

        $this->pools->put($pool->key, $pool);
        $this->poolOwners->put($pool->key, $owner);
    }

    /**
     * @throws AssigneeTypeRepeated
     * @throws AssignmentProviderInvalid
     */
    public function registerAssignees(AssigneeDefinition $definition): void
    {
        if (! Reflector::factory()->isSubclassOf($definition->providerClass, AssigneeProvider::class)) {
            throw AssignmentProviderInvalid::forAssignees($definition->type, $definition->providerClass);
        }

        $this->assigneeProviders->put($definition->type, $definition->providerClass);
    }

    /**
     * @throws AssigneeTypeRepeated
     * @throws AssignmentProviderInvalid
     */
    public function registerActivity(ActivityDefinition $definition): void
    {
        $type = $definition->type->value;

        if (! Reflector::factory()->isSubclassOf($definition->activityClass, AutoAssignmentActivity::class)) {
            throw AssignmentProviderInvalid::forActivity($type, $definition->activityClass);
        }

        $this->activities->put($type, $definition->activityClass);
    }

    public function assertPublic(string $type): void
    {
        if (! $this->purposeOf($type)->isPublic()) {
            throw AssignmentTypeInternal::forType($type);
        }
    }

    public function assertInternal(string $type): void
    {
        if (! $this->purposeOf($type)->isResponsibility()) {
            throw AssignmentTypeUnavailable::forType($type);
        }
    }

    public function journalProvider(string $type): JournalAssignableProvider
    {
        if ($this->purposeOf($type) !== AssignmentPurpose::JournalAssigned) {
            throw AssignmentTypeUnavailable::forType($type);
        }

        return $this->build($this->recordProviders->get($type), JournalAssignableProvider::class);
    }

    public function hasRecordProvider(string $type): bool
    {
        return $this->recordProviders->has($type);
    }

    /**
     * @throws AssignmentTypeUnavailable
     * @throws AssignmentProviderInvalid
     */
    public function recordProvider(string $type): AssignableProvider
    {
        return $this->build($this->recordProviders->get($type), AssignableProvider::class);
    }

    /**
     * @throws AssignmentTypeUnavailable
     * @throws AssignmentProviderInvalid
     */
    public function assigneeProvider(string $type): AssigneeProvider
    {
        return $this->build($this->assigneeProviders->get($type), AssigneeProvider::class);
    }

    /**
     * @throws AssignmentTypeUnavailable
     * @throws AssignmentProviderInvalid
     */
    public function activity(ActorType $type): AutoAssignmentActivity
    {
        return $this->build($this->activities->get($type->value), AutoAssignmentActivity::class);
    }

    /**
     * @throws AssignmentTypeUnavailable
     * @throws AssignmentProviderInvalid
     */
    public function autoAssigner(string $type): AutoAssigner
    {
        return $this->build($this->autoAssigners->get($type)->assignerClass, AutoAssigner::class);
    }

    /**
     * @return class-string<AutoAssigner>
     *
     * @throws AssignmentProviderInvalid
     */
    public function autoAssignerClass(string $type): string
    {
        return $this->autoAssigners->get($type)->assignerClass;
    }

    /**
     * @throws AssignmentTypeUnavailable
     * @throws AssignmentProviderInvalid
     */
    public function assignedWork(string $type): AssignedWorkProvider
    {
        return $this->build($this->autoAssigners->get($type)->workProviderClass, AssignedWorkProvider::class);
    }

    /**
     * @throws AssignmentTypeUnavailable
     * @throws AssignmentProviderInvalid
     */
    public function poolFactory(string $key): AssignmentPoolFactory
    {
        return $this->build($this->pools->get($key)->factoryClass, AssignmentPoolFactory::class);
    }

    /**
     * @throws AssignmentTypeUnavailable
     */
    public function recordOwner(string $type): string
    {
        return $this->recordOwners->get($type);
    }

    /**
     * @throws AssignmentTypeUnavailable
     */
    public function poolOwner(string $key): string
    {
        return $this->poolOwners->get($key);
    }

    public function pools(string $type): array
    {
        return array_values(array_filter(
            $this->pools->all(),
            fn (PoolDefinition $pool) => $pool->assignableType === $type,
        ));
    }

    /**
     * Every registered record type is a link alias whose model is Assignable. Run once every owner has registered its
     * aliases, after the application booted.
     *
     * @throws AssignmentProviderInvalid
     */
    public function checkRecordModels(LinkTypeRegistry $links): void
    {
        foreach ($this->recordProviders->keys() as $type) {
            $model = $links->modelFor($type);

            if (! Reflector::factory()->isSubclassOf($model, Assignable::class)) {
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
        foreach ($this->pools->all() as $key => $pool) {
            $owner = $this->poolOwners->get($key);

            $recordOwner = $this->recordOwners->find($pool->assignableType)
                ->getOrThrow(AutoAssignmentDeclarationRefused::typeNotAssignable($pool->assignableType, $owner));

            if ($recordOwner !== $owner && ! in_array($recordOwner, $this->owners->get($owner), true)) {
                throw AutoAssignmentDeclarationRefused::poolOfUnrelatedOwner($key, $owner, $recordOwner);
            }
        }
    }

    /**
     * @throws AutoAssignmentDeclarationRefused
     */
    private function requireOwner(string $owner): void
    {
        $this->owners->get($owner);
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
        $built = Container::getInstance()->make($registeredClass);

        if (! Reflector::of($contract)->isInstance($built)) {
            throw AssignmentProviderInvalid::forResolved($registeredClass, $built::class, $contract);
        }

        return $built;
    }

    /**
     * @throws AssignmentTypeUnavailable
     */
    private function purposeOf(string $type): AssignmentPurpose
    {
        return $this->recordPurposes->get($type);
    }
}
