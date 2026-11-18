<?php

declare(strict_types=1);

namespace App\Reads\Support;

use App\Reads\Exceptions\ModelReadAllRefused;
use App\Reads\Values\ReadOrder;
use Illuminate\Container\Container;
use Illuminate\Database\Query\Builder as QueryBuilder;

/**
 * Bounds every plain read of a model: at most reads.default_limit rows, newest first, unless the read names a
 * larger one. A model without created_at overrides defaultReadOrder().
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
        return ReadOrder::newestFirst($this->getTable(), $this->getKeyName());
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
