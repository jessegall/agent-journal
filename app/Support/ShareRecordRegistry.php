<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Sharing\Shareable;
use App\Contracts\Sharing\ShareRecordProvider;
use App\Exceptions\InvalidRecordIdentity;
use App\Exceptions\RecordUnavailable;
use App\Exceptions\ShareRecordInvalid;
use App\Exceptions\ShareRelationInvalid;
use App\Exceptions\UnknownShareRecordType;
use App\Exceptions\UnknownShareRelation;
use App\Values\ProjectOwner;
use Illuminate\Container\Container;

/**
 * Every shareable record type by its alias: its model, provider, advertised capabilities and the relations its model
 * declared, read once at boot. It keeps class names only and builds a provider when one is asked for.
 */
final class ShareRecordRegistry
{
    /**
     * @var Registry<ShareRecordDefinition>
     */
    private readonly Registry $definitions;

    /**
     * @var Registry<ShareRelationSet>
     */
    private readonly Registry $relationSets;

    public function __construct()
    {
        $this->definitions = Registry::once(UnknownShareRecordType::forAlias(...), ShareRecordInvalid::repeated(...));
        $this->relationSets = Registry::replacing(UnknownShareRecordType::forAlias(...));
    }

    /**
     * @throws InvalidRecordIdentity
     * @throws ShareRecordInvalid
     */
    public function register(ShareRecordDefinition $definition): void
    {
        $alias = $definition->alias;
        RecordIdentity::assertKnownType($alias);

        if (! ReflectedType::factory()->isSubclassOf($definition->modelClass, Shareable::class)) {
            throw ShareRecordInvalid::notShareable($alias, $definition->modelClass);
        }

        if (! ReflectedType::factory()->isSubclassOf($definition->providerClass, ShareRecordProvider::class)) {
            throw ShareRecordInvalid::notAProvider($alias, $definition->providerClass);
        }

        $this->definitions->put($alias, $definition);
    }

    /**
     * Reads the relations of every registered model once and checks none is declared twice. A relation may need a
     * capability no registered record advertises, as when the domain that offers it is switched off: it then reaches
     * no record. Run once every domain has registered, after the application booted.
     *
     * @throws ShareRecordInvalid
     * @throws ShareRelationInvalid
     */
    public function checkRelations(): void
    {

        foreach ($this->definitions->all() as $alias => $definition) {
            $model = $definition->modelClass;

            if (! ReflectedType::factory()->isSubclassOf($model, Shareable::class)) {
                throw ShareRecordInvalid::notShareable($alias, $model);
            }

            $relations = $model::shareRelations();
            $names = [];

            foreach ($relations->relations as $relation) {
                if (in_array($relation->name, $names, true)) {
                    throw ShareRelationInvalid::repeated($alias, $relation->name);
                }

                $names[] = $relation->name;
            }

            $this->relationSets->put($alias, $relations);
        }
    }

    public function has(string $alias): bool
    {
        return $this->definitions->has($alias);
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
    public function get(string $alias): ShareRecordDefinition
    {
        return $this->definitions->get($alias);
    }

    /**
     * @throws UnknownShareRecordType
     */
    public function provider(string $alias): ShareRecordProvider
    {
        return Container::getInstance()->make($this->get($alias)->providerClass);
    }

    /**
     * The owner of a share's root, as its type's provider answers it: the root's project, or Global.
     *
     * @throws UnknownShareRecordType
     * @throws RecordUnavailable when the root is missing
     */
    public function ownerOf(RecordIdentity $root): ProjectOwner
    {
        return $this->provider($root->type)->ownerOf($root);
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
