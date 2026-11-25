<?php

declare(strict_types=1);

namespace App\Support;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Reads every matching row in batches by ascending key, up to the highest key that matched when it began, so rows
 * added during the read are not chased. It uses no offset.
 *
 * @template TModel of Model
 */
final readonly class ChunkedRead
{
    /**
     * @param  ReadBuilder<TModel>  $query
     */
    public function __construct(private ReadBuilder $query, private int $size) {}

    /**
     * @param  callable(Collection<int, TModel>): (bool|void)  $each
     */
    public function run(callable $each): void
    {
        ReadMeter::ofCurrentScope()->withinSchedule('chunked read', fn () => $this->readBatches($each));
    }

    /**
     * @param  callable(Collection<int, TModel>): (bool|void)  $each
     */
    private function readBatches(callable $each): void
    {
        $key = $this->query->getModel()->getQualifiedKeyName();
        $highest = (clone $this->query)->toBase()->reorder()->max($key);
        $last = null;

        while ($highest !== null) {
            $batch = (clone $this->query)
                ->readAll('one key batch of a chunked read')
                ->reorder()
                ->when($last !== null, fn (ReadBuilder $read) => $read->where($key, '>', $last))
                ->where($key, '<=', $highest)
                ->orderBy($key)
                ->limit($this->size)
                ->get();

            if ($batch->isEmpty() || $each($batch) === false || $batch->count() < $this->size) {
                return;
            }

            $last = $batch->last()->getKey();
        }
    }
}
