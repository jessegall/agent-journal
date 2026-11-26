<?php

declare(strict_types=1);

namespace App\Links;

use App\Exceptions\UnknownLinkType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Relation;

/**
 * The stable names links store for models, such as tasks.task, instead of their class names: the morph map MorphAliases
 * works out. Links are written only with names the map holds.
 */
final class LinkTypeRegistry
{
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
