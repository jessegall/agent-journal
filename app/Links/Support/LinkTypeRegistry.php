<?php

declare(strict_types=1);

namespace App\Links\Support;

use App\Links\Exceptions\LinkTypeRepeated;
use App\Links\Exceptions\UnknownLinkType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Relation;

/**
 * The stable names links store for linkable models, such as tasks.task, instead of their class names. Each owner
 * registers its own models; a name or a model registered twice for different partners is refused, the same pair again
 * is accepted. Links are written only with registered names.
 */
final class LinkTypeRegistry
{
    /**
     * @param  array<string, class-string<Model>>  $modelOfName
     */
    public function register(array $modelOfName): void
    {
        $known = Relation::morphMap();

        foreach ($modelOfName as $name => $model) {
            $registeredModel = $known[$name] ?? null;
            $registeredName = array_search($model, $known, true);

            if (($registeredModel !== null && $registeredModel !== $model) || ($registeredName !== false && $registeredName !== $name)) {
                throw LinkTypeRepeated::for($name, $model);
            }
        }

        Relation::requireMorphMap();
        Relation::morphMap($modelOfName);
    }

    /**
     * Refuses a link name no owner registered, for a link written without loading its record.
     *
     * @throws UnknownLinkType
     */
    public function requireRegistered(string $alias): void
    {
        $this->modelFor($alias);
    }

    /**
     * The model a registered link name stands for.
     *
     * @return class-string<Model>
     *
     * @throws UnknownLinkType
     */
    public function modelFor(string $alias): string
    {
        return Relation::getMorphedModel($alias) ?? throw UnknownLinkType::forAlias($alias);
    }
}
