<?php

declare(strict_types=1);

namespace App\Support;

use App\Exceptions\ReadLimitExceeded;
use App\Exceptions\ReadShapeUnsupported;
use App\Exceptions\RelationReadUndeclared;
use App\Reads\ReadMeter;
use App\Reads\Values\PageSize;
use App\Records\Contracts\ReadableModel;
use Closure;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use PhpOption\Option;

/**
 * The query builder of a model with BoundedReads: a read without an order of its own is read in the model's default
 * order, a page holds at most reads.page_max rows, a scan goes by key batches, and a to-many eager load declares how
 * many rows it reads.
 *
 * @template TModel of Model
 *
 * @extends Builder<TModel>
 */
class ReadBuilder extends Builder
{
    private int|null $completeRelationMax = null;

    /**
     * Creates the row with no savepoint: a command runs in the bus's own transaction, which refuses any other, so a
     * row created at the same moment by another writer fails the command with its unique violation.
     *
     * @param  array<string, mixed>  $attributes
     * @param  (Closure(): array<string, mixed>)|array<string, mixed>  $creationAttributes
     * @return TModel
     */
    public function createOrFirst(array $attributes = [], Closure|array $creationAttributes = [])
    {
        return $this->create(array_merge($attributes, value($creationAttributes)));
    }

    /**
     * The first row the query finds, or none.
     *
     * @return Option<TModel>
     */
    public function firstOption(): Option
    {
        return Option::fromValue($this->first());
    }

    /**
     * Read as the eager load of a to-many relation declared complete up to the given number of rows.
     */
    public function readRelationCompletely(int $max): void
    {
        $this->completeRelationMax = $max;
        $this->limit($max + 1);
    }

    /**
     * Only the keys of the rows, as a subquery another query matches its column against.
     */
    public function keys(): static
    {
        $key = $this->model->getQualifiedKeyName();

        return $this->select($key);
    }

    /**
     * The rows whose key is none of those the subquery gives.
     *
     * @param  Builder<covariant Model>  $keys
     */
    public function excludingKeys(Builder $keys): static
    {
        $key = $this->model->getQualifiedKeyName();

        return $this->whereNotIn($key, $keys);
    }

    /**
     * @param  array<int, string>|string  $columns
     * @return array<int, TModel>
     */
    public function getModels($columns = ['*']): array
    {
        $this->orderForReading();

        return parent::getModels($columns);
    }

    /**
     * @param  string  $column
     * @param  string|null  $key
     */
    public function pluck($column, $key = null)
    {
        $this->orderForReading();

        return parent::pluck($column, $key);
    }

    public function cursor()
    {
        $this->orderForReading();

        return parent::cursor();
    }

    /**
     * @param  int|null  $perPage
     * @param  array<int, string>  $columns
     * @param  string  $pageName
     * @param  int|null  $page
     * @param  (Closure(): int)|int|null  $total
     */
    public function paginate($perPage = null, $columns = ['*'], $pageName = 'page', $page = null, $total = null)
    {
        return parent::paginate(PageSize::from($perPage)->rows, $columns, $pageName, $page, $total);
    }

    /**
     * @param  int|null  $perPage
     * @param  array<int, string>  $columns
     * @param  string  $pageName
     * @param  int|null  $page
     */
    public function simplePaginate($perPage = null, $columns = ['*'], $pageName = 'page', $page = null)
    {
        return parent::simplePaginate(PageSize::from($perPage)->rows, $columns, $pageName, $page);
    }

    /**
     * @param  int|null  $perPage
     * @param  array<int, string>  $columns
     * @param  string  $cursorName
     */
    public function cursorPaginate($perPage = null, $columns = ['*'], $cursorName = 'cursor', $cursor = null)
    {
        return parent::cursorPaginate(PageSize::from($perPage)->rows, $columns, $cursorName, $cursor);
    }

    /**
     * @param  int  $count
     */
    public function chunk($count, callable $callback): bool
    {
        throw ReadShapeUnsupported::method('chunk');
    }

    /**
     * @param  int  $count
     */
    public function each(callable $callback, $count = 1000): bool
    {
        throw ReadShapeUnsupported::method('each');
    }

    /**
     * Every matching row in batches by ascending key, read again on purpose for each batch.
     *
     * @param  int  $count
     * @param  string|null  $column
     * @param  string|null  $alias
     */
    public function chunkById($count, callable $callback, $column = null, $alias = null): bool
    {
        return ReadMeter::ofCurrentScope()->withinSchedule(
            'chunked read',
            fn (): bool => parent::chunkById($count, $callback, $column, $alias),
        );
    }

    /**
     * @param  int  $chunkSize
     */
    public function lazy($chunkSize = 1000): never
    {
        throw ReadShapeUnsupported::method('lazy');
    }

    /**
     * @param  int  $chunkSize
     * @param  string|null  $column
     * @param  string|null  $alias
     */
    public function lazyById($chunkSize = 1000, $column = null, $alias = null): never
    {
        throw ReadShapeUnsupported::method('lazyById');
    }

    /**
     * A to-one relation reads one row per parent, so its eager load is bounded by the parents; a to-many relation
     * must declare how many rows it reads, and a complete one must hold no more than declared.
     *
     * @param  array<int, TModel>  $models
     * @param  string  $name
     * @return array<int, TModel>
     */
    protected function eagerLoadRelation(array $models, $name, Closure $constraints): array
    {
        $relation = $this->getRelation($name);
        $relation->addEagerConstraints($models);
        $constraints($relation);
        $query = $relation->getQuery();

        $readsOnePerParent = $relation instanceof BelongsTo
            || $relation instanceof HasOne
            || $relation instanceof MorphOne
            || $relation instanceof MorphTo;

        if ($query instanceof self && ! $readsOnePerParent && $query->completeRelationMax === null) {
            throw RelationReadUndeclared::for($name);
        }

        // The relation is set empty on every parent before it is read, as a morph relation sets its models while read.
        $parents = $relation->initRelation($models, $name);
        $relatedModels = $relation->getEager();

        if ($query instanceof self && $query->holdsMoreThanDeclared($relatedModels->count())) {
            throw ReadLimitExceeded::forRelation($name, (int) $query->completeRelationMax);
        }

        return $relation->match($parents, $relatedModels, $name);
    }

    /**
     * A grouped read without an order of its own is read in the order of its groups.
     *
     * @param  array<mixed>  $groups
     */
    private function orderByGroups(array $groups): void
    {
        $query = $this->getQuery();

        if ($query->orders !== null && $query->orders !== []) {
            return;
        }

        foreach ($groups as $group) {
            $query->orderBy($group);
        }
    }

    private function orderForReading(): void
    {
        $query = $this->getQuery();

        if ($query->groups !== null && $query->groups !== []) {
            $this->orderByGroups($query->groups);

            return;
        }

        if ($query->unions !== null && $query->unions !== []) {
            return;
        }

        $key = $this->model->getQualifiedKeyName();
        $orders = $query->orders ?? [];

        if ($orders === [] && $this->model instanceof ReadableModel) {
            foreach ($this->model->defaultReadOrder()->columns as $order) {
                $query->orderBy($order['column'], $order['direction']);
            }

            return;
        }

        $orderedColumns = array_column($orders, 'column');

        $ordersByKey = in_array($key, $orderedColumns, true) || in_array(
            $this->model->getKeyName(),
            $orderedColumns,
            true,
        );

        if ($orders !== [] && ! $ordersByKey) {
            $query->orderBy($key);
        }
    }

    /**
     * Whether a relation read declared complete got more rows than it declared.
     */
    private function holdsMoreThanDeclared(int $rows): bool
    {
        return $this->completeRelationMax !== null && $rows > $this->completeRelationMax;
    }
}
