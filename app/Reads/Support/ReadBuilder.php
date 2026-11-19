<?php

declare(strict_types=1);

namespace App\Reads\Support;

use App\Reads\Contracts\ReadableModel;
use App\Reads\Enums\ReadMode;
use App\Reads\Exceptions\ReadLimitExceeded;
use App\Reads\Exceptions\ReadLimitInvalid;
use App\Reads\Exceptions\ReadLimitTooLarge;
use App\Reads\Exceptions\ReadReasonMissing;
use App\Reads\Exceptions\ReadShapeUnsupported;
use App\Reads\Exceptions\RelationReadUndeclared;
use App\Reads\Values\PageSize;
use Closure;
use Illuminate\Container\Container;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\Relations\MorphTo;

/**
 * The query builder of a model with BoundedReads. A plain read returns at most the model's default rows, newest
 * first; a larger read is named (readLimit, readAll, readInChunks) or paged. Counts, sums and writes are never
 * limited.
 *
 * @template TModel of Model
 *
 * @extends Builder<TModel>
 */
class ReadBuilder extends Builder
{
    private ReadMode $mode = ReadMode::Default;

    private int|null $namedLimit = null;

    private int|null $completeRelationMax = null;

    /**
     * A known set larger than a page, such as the rows of 300 given ids.
     *
     * @throws ReadLimitInvalid
     */
    public function readLimit(int $rows): static
    {
        if ($rows < 0) {
            throw ReadLimitInvalid::rows($rows);
        }

        $this->mode = ReadMode::Limited;
        $this->namedLimit = $rows;

        return $this;
    }

    /**
     * Every matching row, for the reason given, keeping every scope and order of the query.
     *
     * @throws ReadReasonMissing
     */
    public function readAll(string $reason): static
    {
        if (trim($reason) === '') {
            throw ReadReasonMissing::create();
        }

        $this->mode = ReadMode::Unbounded;

        return $this;
    }

    /**
     * Every matching row in batches by ascending key; the callback gets each batch and may stop with false.
     *
     * @param  callable(Collection<int, TModel>): (bool|void)  $each
     */
    public function readInChunks(int $size, callable $each): void
    {
        $this->mode = ReadMode::Chunked;
        new ChunkedRead($this, $size)->run($each);
    }

    /**
     * Read as the eager load of a to-many relation declared complete up to the given number of rows.
     */
    public function readRelationCompletely(int $max): void
    {
        $this->completeRelationMax = $max;
        $this->readLimit($max + 1);
    }

    /**
     * @param  array<int, string>|string  $columns
     * @return array<int, TModel>
     */
    public function getModels($columns = ['*']): array
    {
        $this->applyReadPolicy();

        return parent::getModels($columns);
    }

    /**
     * @param  string  $column
     * @param  string|null  $key
     */
    public function pluck($column, $key = null)
    {
        $this->applyReadPolicy();

        return parent::pluck($column, $key);
    }

    public function cursor()
    {
        $this->applyReadPolicy();

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
        throw ReadShapeUnsupported::method('chunk', 'readInChunks($size, $each)');
    }

    /**
     * @param  int  $count
     */
    public function each(callable $callback, $count = 1000): bool
    {
        throw ReadShapeUnsupported::method('each', 'readInChunks($size, $each)');
    }

    /**
     * @param  int  $count
     * @param  string|null  $column
     * @param  string|null  $alias
     */
    public function chunkById($count, callable $callback, $column = null, $alias = null): bool
    {
        throw ReadShapeUnsupported::method('chunkById', 'readInChunks($size, $each)');
    }

    /**
     * @param  int  $chunkSize
     */
    public function lazy($chunkSize = 1000): never
    {
        throw ReadShapeUnsupported::method('lazy', 'readInChunks($size, $each)');
    }

    /**
     * @param  int  $chunkSize
     * @param  string|null  $column
     * @param  string|null  $alias
     */
    public function lazyById($chunkSize = 1000, $column = null, $alias = null): never
    {
        throw ReadShapeUnsupported::method('lazyById', 'readInChunks($size, $each)');
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

        if ($query instanceof self && $readsOnePerParent) {
            $query->readAll('one row per parent of the eager load');
        }

        if ($query instanceof self && ! $readsOnePerParent && $query->completeRelationMax === null) {
            throw RelationReadUndeclared::for($name);
        }

        $results = $relation->getEager();

        if ($query instanceof self && $query->holdsMoreThanDeclared($results->count())) {
            throw ReadLimitExceeded::forRelation($name, (int) $query->completeRelationMax);
        }

        return $relation->match($relation->initRelation($models, $name), $results, $name);
    }

    /**
     * Puts the default limit and order on a plain read, and the unique key last in any order.
     *
     * @throws ReadLimitTooLarge
     */
    private function applyReadPolicy(): void
    {
        $query = $this->getQuery();
        $pageMax = Container::getInstance()->make('config')->integer('reads.page_max');

        $query->limit = match ($this->mode) {
            ReadMode::Limited => $query->limit === null ? $this->namedLimit : min(
                (int) $query->limit,
                (int) $this->namedLimit,
            ),
            ReadMode::Unbounded, ReadMode::Chunked => $query->limit,
            ReadMode::Default => $query->limit ?? $this->defaultLimit(),
        };

        if (! $this->mode->mayExceedPage() && $query->limit !== null && $query->limit > $pageMax) {
            throw ReadLimitTooLarge::rows((int) $query->limit, $pageMax);
        }

        $this->orderForReading();
    }

    private function orderForReading(): void
    {
        $query = $this->getQuery();

        if ($query->groups !== null && $query->groups !== []) {
            if ($query->orders === null || $query->orders === []) {
                foreach ($query->groups as $group) {
                    $query->orderBy($group);
                }
            }

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

    private function defaultLimit(): int
    {
        return $this->model instanceof ReadableModel
            ? $this->model->defaultReadLimit()
            : Container::getInstance()->make('config')->integer('reads.default_limit');
    }
}
