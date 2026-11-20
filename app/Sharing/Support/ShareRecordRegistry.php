<?php

declare(strict_types=1);

namespace App\Sharing\Support;

use App\Records\Exceptions\InvalidRecordIdentity;
use App\Records\Support\RecordIdentity;
use App\Registries\Support\Registry;
use App\Sharing\Contracts\Shareable;
use App\Sharing\Contracts\ShareRecordProvider;
use App\Sharing\Exceptions\ShareRecordInvalid;
use App\Sharing\Exceptions\ShareRelationInvalid;
use App\Sharing\Exceptions\UnknownShareRecordType;
use App\Sharing\Exceptions\UnknownShareRelation;
use Illuminate\Container\Container;

/**
 * Every shareable record type by its alias: its model, provider, advertised capabilities and the relations its model
 * declared, read once at boot. It keeps class names only and builds a provider when one is asked for.
 */
final class ShareRecordRegistry
{
    /**
     * @var Registry<ShareRecordRegistration>
     */
    private readonly Registry $registrations;

    /**
     * @var Registry<ShareRelationSet>
     */
    private readonly Registry $relationSets;

    public function __construct()
    {
        $this->registrations = Registry::once(UnknownShareRecordType::forAlias(...), ShareRecordInvalid::repeated(...));
        $this->relationSets = Registry::replacing(UnknownShareRecordType::forAlias(...));
    }

    /**
     * @throws InvalidRecordIdentity
     * @throws ShareRecordInvalid
     */
    public function register(ShareRecordRegistration $registration): void
    {
        $alias = $registration->alias;
        RecordIdentity::assertKnownType($alias);

        if (! is_subclass_of($registration->modelClass, Shareable::class)) {
            throw ShareRecordInvalid::notShareable($alias, $registration->modelClass);
        }

        if (! is_subclass_of($registration->providerClass, ShareRecordProvider::class)) {
            throw ShareRecordInvalid::notAProvider($alias, $registration->providerClass);
        }

        $this->registrations->put($alias, $registration);
    }

    /**
     * Reads the relations of every registered model once and checks each names a capability some registered record
     * advertises. Run once every domain has registered, after the application booted.
     *
     * @throws ShareRelationInvalid
     */
    public function checkRelations(): void
    {
        $capabilities = array_merge(...array_map(
            fn (ShareRecordRegistration $registration) => $registration->capabilities,
            array_values($this->registrations->all()),
        ));

        foreach ($this->registrations->all() as $alias => $registration) {
            $relations = $registration->modelClass::shareRelations();
            $names = [];

            foreach ($relations->relations as $relation) {
                if (in_array($relation->name, $names, true)) {
                    throw ShareRelationInvalid::repeated($alias, $relation->name);
                }

                if (! in_array($relation->capability, $capabilities, true)) {
                    throw ShareRelationInvalid::unknownCapability($alias, $relation->name, $relation->capability);
                }

                $names[] = $relation->name;
            }

            $this->relationSets->put($alias, $relations);
        }
    }

    public function has(string $alias): bool
    {
        return $this->registrations->has($alias);
    }

    /**
     * @throws UnknownShareRecordType when no domain registered the type for sharing
     */
    public function requireShareable(string $alias): void
    {
        $this->get($alias);
    }

    /**
     * @throws UnknownShareRecordType
     */
    public function get(string $alias): ShareRecordRegistration
    {
        return $this->registrations->get($alias);
    }

    /**
     * @throws UnknownShareRecordType
     */
    public function provider(string $alias): ShareRecordProvider
    {
        return Container::getInstance()->make($this->get($alias)->providerClass);
    }

    /**
     * The relations the type declared, as read at boot.
     *
     * @throws UnknownShareRecordType
     */
    public function relations(string $alias): ShareRelationSet
    {
        return $this->relationSets->get($alias);
    }

    /**
     * The declared relation of this name, from the relations read at boot.
     *
     * @throws UnknownShareRecordType
     * @throws UnknownShareRelation
     */
    public function relation(string $alias, string $name): ShareRelation
    {
        return $this->relations($alias)->find($name)->getOrThrow(UnknownShareRelation::for($alias, $name));
    }
}
