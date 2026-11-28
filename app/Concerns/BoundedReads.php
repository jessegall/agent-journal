<?php

declare(strict_types=1);

namespace App\Concerns;

use App\Exceptions\LazyLoadRefused;
use App\Exceptions\ModelReadAllRefused;
use App\Reads\ReadMeter;
use App\Records\Values\ReadOrder;
use App\Support\BoundedReadBuilder;
use Illuminate\Database\Query\Builder as QueryBuilder;

/**
 * Guards the reads of a model: newest first unless the read names an order, no lazy load, no query in an accessor
 * and no read of every row. A model without a creation time overrides defaultReadOrder().
 */
trait BoundedReads
{
    use CountsLoads;

    /**
     * @param  QueryBuilder  $query
     * @return BoundedReadBuilder<*>
     */
    public function newEloquentBuilder($query): BoundedReadBuilder
    {
        return new BoundedReadBuilder($query);
    }

    public function defaultReadOrder(): ReadOrder
    {
        return ReadOrder::newestFirst($this->getTable(), (string) $this->getCreatedAtColumn(), $this->getKeyName());
    }

    /**
     * The row with this id, locked for update until the transaction ends; a missing row fails the read.
     */
    public static function findLockedById(string $id): static
    {
        return static::query()->whereKey($id)->lockForUpdate()->firstOrFail();
    }

    /**
     * An accessor's value comes from what is loaded; a query inside it is refused.
     *
     * @param  string  $key
     */
    protected function mutateAttribute($key, $value): mixed
    {
        return ReadMeter::ofCurrentScope()->withoutQueries(
            static::class."::{$key} accessor",
            fn () => parent::mutateAttribute($key, $value),
        );
    }

    /**
     * @param  string  $key
     */
    protected function mutateAttributeMarkedAttribute($key, $value): mixed
    {
        return ReadMeter::ofCurrentScope()->withoutQueries(
            static::class."::{$key} accessor",
            fn () => parent::mutateAttributeMarkedAttribute($key, $value),
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return ReadMeter::ofCurrentScope()->withoutQueries(static::class.'::toArray', fn () => parent::toArray());
    }

    /**
     * Touching a relation that is not loaded would query once per model; it is refused before any query, for one
     * fetched model, a new one and a pivot alike.
     *
     * @param  string  $method
     *
     * @throws LazyLoadRefused
     */
    protected function getRelationshipFromMethod($method): never
    {
        throw LazyLoadRefused::for(static::class, $method);
    }

    /**
     * @param  array<int, string>|string  $columns
     *
     * @throws ModelReadAllRefused
     */
    public static function all($columns = ['*']): never
    {
        throw ModelReadAllRefused::for(static::class);
    }
}
