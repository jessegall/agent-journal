<?php

declare(strict_types=1);

namespace App\Support\Drivers;

use Closure;

/**
 * The process and generation of the driver worker whose command runs now, so every command it runs is fenced, a
 * report as much as an order.
 */
final class WorkerLease
{
    private string|null $processId = null;

    private int $generation = 0;

    /**
     * @template TResult
     *
     * @param  Closure(): TResult  $work
     * @return TResult
     */
    public function hold(string $processId, int $generation, Closure $work): mixed
    {
        $this->processId = $processId;
        $this->generation = $generation;

        try {
            return $work();
        } finally {
            $this->processId = null;
        }
    }

    public function processId(): string|null
    {
        return $this->processId;
    }

    public function generation(): int
    {
        return $this->generation;
    }
}
