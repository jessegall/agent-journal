<?php

declare(strict_types=1);

namespace App\Reads\Support;

use App\Reads\Exceptions\LazyLoadRefused;
use App\Reads\Exceptions\ModelReadAllRefused;
use App\Reads\Values\ReadOrder;
use Illuminate\Container\Container;
use Illuminate\Database\Query\Builder as QueryBuilder;

/**
 * Bounds every plain read of a model: at most reads.default_limit rows, newest first, unless the read names a
 * larger one. A model without a creation time overrides defaultReadOrder().
 */
trait BoundedReads
{
    use CountsLoads;

    /**
     * @param  QueryBuilder  $query
     * @return ReadBuilder<*>
     */
    public function newEloquentBuilder($query): ReadBuilder
    {
        return new ReadBuilder($query);
    }

    public function defaultReadLimit(): int
    {
        return (int) Container::getInstance()->make('config')->get('reads.default_limit', 50);
    }

    public function defaultReadOrder(): ReadOrder
    {
        return ReadOrder::newestFirst($this->getTable(), (string) $this->getCreatedAtColumn(), $this->getKeyName());
    }

    /**
     * An accessor's value comes from what is loaded; a query inside it is refused.
     *
     * @param  string  $key
     */
    protected function mutateAttribute($key, $value): mixed
    {
        return ScopedReadMeter::ofCurrentScope()->withoutQueries(static::class."::{$key} accessor", fn () => parent::mutateAttribute($key, $value));
    }

    /**
     * @param  string  $key
     */
    protected function mutateAttributeMarkedAttribute($key, $value): mixed
    {
        return ScopedReadMeter::ofCurrentScope()->withoutQueries(static::class."::{$key} accessor", fn () => parent::mutateAttributeMarkedAttribute($key, $value));
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return ScopedReadMeter::ofCurrentScope()->withoutQueries(static::class.'::toArray', fn () => parent::toArray());
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
