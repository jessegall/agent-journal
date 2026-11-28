<?php

declare(strict_types=1);

namespace App\Bus\Contracts;

use Closure;

interface RequestKey
{
    public const int LONGEST = 128;

    /**
     * Keeps the idempotency key the running request carries, so its write is receipted under it.
     */
    public function set(string $key): void;

    /**
     * Drops the key once the request that carried it ends.
     */
    public function forget(): void;

    /**
     * The key of this request's write, or null when the call carries none.
     */
    public function key(): string|null;

    /**
     * @param  class-string  $command
     */
    public function requireFor(string $command): string;

    /**
     * Runs a write under its own receipt key and restores the enclosing request afterward.
     *
     * @template TResult
     *
     * @param  Closure(): TResult  $work
     * @return TResult
     */
    public function independently(string $key, Closure $work): mixed;
}
