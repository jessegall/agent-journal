<?php

declare(strict_types=1);

namespace Tests\Support\Seeding;

use Illuminate\Database\Eloquent\Model;
use Tests\Support\Seeding\Exceptions\FixtureRefused;

/**
 * The names a domain fixture gives the records it arranges, each kept as the record's type and id, apart from any
 * title it shows: a name is taken once, and reading one back finds that exact row.
 */
final class FixtureAliases
{
    /**
     * @var array<string, array<string, int|string>> ids by type, then by name
     */
    private array $ids = [];

    public function __construct(private readonly string $owner) {}

    /**
     * Refuses a name already taken by any record of this fixture, before the caller writes a row for it.
     */
    public function claim(string $alias): void
    {
        foreach ($this->ids as $type => $named) {
            if (array_key_exists($alias, $named)) {
                throw FixtureRefused::occupiedAlias($alias, $type);
            }
        }
    }

    /**
     * @template TModel of Model
     *
     * @param  TModel  $model
     * @return TModel
     */
    public function remember(string $alias, Model $model): Model
    {
        $this->rememberResult($alias, $model->getKey(), $model::class);

        return $model;
    }

    /**
     * Keeps the id a command answered with, or the key it was run under, as the record of this type.
     */
    public function rememberResult(string $alias, int|string $id, string $type): void
    {
        $this->claim($alias);
        $this->ids[$type][$alias] = $id;
    }

    public function read(string $type, string $alias): int|string
    {
        return $this->ids[$type][$alias] ?? throw FixtureRefused::missingAlias($type, $alias, $this->owner);
    }

    /**
     * The row of that type kept under the name, read fresh.
     *
     * @template TModel of Model
     *
     * @param  class-string<TModel>  $type
     * @return TModel
     */
    public function model(string $type, string $alias): Model
    {
        return $type::query()->withoutGlobalScopes()->findOrFail($this->read($type, $alias));
    }
}
