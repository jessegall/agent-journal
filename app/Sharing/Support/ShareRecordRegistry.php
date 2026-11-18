<?php

declare(strict_types=1);

namespace App\Sharing\Support;

use App\Records\Exceptions\InvalidRecordIdentity;
use App\Records\Support\RecordIdentity;
use App\Sharing\Contracts\Shareable;
use App\Sharing\Contracts\ShareRecordProvider;
use App\Sharing\Exceptions\ShareRecordInvalid;
use App\Sharing\Exceptions\ShareRelationInvalid;
use App\Sharing\Exceptions\UnknownShareRecordType;
use App\Sharing\Exceptions\UnknownShareRelation;
use Illuminate\Contracts\Container\Container;

/**
 * Every shareable record type by its alias: its model, provider, advertised capabilities and the relations its model
 * declared, read once at boot. It keeps class names only and builds a provider when one is asked for.
 */
final class ShareRecordRegistry
{
    /**
     * @var array<string, ShareRecordRegistration>
     */
    private array $registrations = [];

    /**
     * @var array<string, ShareRelationSet>
     */
    private array $relationSets = [];

    public function __construct(private readonly Container $container) {}

    /**
     * @throws InvalidRecordIdentity
     * @throws ShareRecordInvalid
     */
    public function register(ShareRecordRegistration $registration): void
    {
        $alias = $registration->alias;
        RecordIdentity::checkType($alias);

        if (array_key_exists($alias, $this->registrations)) {
            throw ShareRecordInvalid::repeated($alias);
        }

        if (! is_subclass_of($registration->modelClass, Shareable::class)) {
            throw ShareRecordInvalid::notShareable($alias, $registration->modelClass);
        }

        if (! is_subclass_of($registration->providerClass, ShareRecordProvider::class)) {
            throw ShareRecordInvalid::notAProvider($alias, $registration->providerClass);
        }

        $this->registrations[$alias] = $registration;
    }

    /**
     * Reads the relations of every registered model once and checks each names a capability some registered record
     * advertises. Run once every domain has registered, after the application booted.
     *
     * @throws ShareRelationInvalid
     */
    public function checkRelations(): void
    {
        $capabilities = array_merge(...array_map(fn (ShareRecordRegistration $registration) => $registration->capabilities, array_values($this->registrations)));

        foreach ($this->registrations as $alias => $registration) {
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

            $this->relationSets[$alias] = $relations;
        }
    }

    public function has(string $alias): bool
    {
        return array_key_exists($alias, $this->registrations);
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
        return $this->registrations[$alias] ?? throw UnknownShareRecordType::forAlias($alias);
    }

    /**
     * @throws UnknownShareRecordType
     */
    public function provider(string $alias): ShareRecordProvider
    {
        return $this->container->make($this->get($alias)->providerClass);
    }

    /**
     * The relations the type declared, as read at boot.
     *
     * @throws UnknownShareRecordType
     */
    public function relations(string $alias): ShareRelationSet
    {
        return $this->relationSets[$alias] ?? throw UnknownShareRecordType::forAlias($alias);
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
