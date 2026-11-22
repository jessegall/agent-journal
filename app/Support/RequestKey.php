<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Bus\RequestKey as RequestKeyContract;
use App\Exceptions\RequestKeyInvalid;
use App\Exceptions\RequestKeyMissing;
use Closure;
use Illuminate\Container\Attributes\Scoped;

/**
 * The request key of this request's write, set by the transport that received it, and which command dispatch is the
 * outermost one: only that one is receipted under the key. Scoped, so the next request starts with none.
 */
#[Scoped]
final class RequestKey implements RequestKeyContract
{
    private const string FORM = '/^[A-Za-z0-9-]+$/';

    private string|null $key = null;

    private int $depth = 0;

    private bool $receiptTaken = false;

    /**
     * @throws RequestKeyInvalid
     */
    public function set(string $key): void
    {
        if (strlen($key) > self::LONGEST || preg_match(self::FORM, $key) !== 1) {
            throw RequestKeyInvalid::for($key);
        }

        $this->key = $key;
    }

    /**
     * Ends the request's key, so nothing after the request is keyed by it.
     */
    public function forget(): void
    {
        $this->key = null;
        $this->receiptTaken = false;
    }

    /**
     * Notes that the outermost command took its receipt under the request's key.
     */
    public function markReceiptTaken(): void
    {
        $this->receiptTaken = true;
    }

    public function wasReceiptTaken(): bool
    {
        return $this->receiptTaken;
    }

    /**
     * The key of this request's write, or null when the call carries none.
     */
    public function key(): string|null
    {
        return $this->key;
    }

    /**
     * @param  class-string  $command
     */
    public function requireFor(string $command): string
    {
        if ($this->key === null) {
            throw RequestKeyMissing::for($command);
        }

        return $this->key;
    }

    /**
     * Runs one command dispatch, counting how deep it is nested.
     *
     * @template TResult
     *
     * @param  Closure(): TResult  $work
     * @return TResult
     */
    public function dispatching(Closure $work): mixed
    {
        $this->depth++;

        try {
            return $work();
        } finally {
            $this->depth--;
        }
    }

    /**
     * @template TResult
     *
     * @param  Closure(): TResult  $work
     * @return TResult
     */
    public function independently(string $key, Closure $work): mixed
    {
        $before = [$this->key, $this->depth, $this->receiptTaken];
        $this->set($key);
        $this->depth = 0;
        $this->receiptTaken = false;

        try {
            return $work();
        } finally {
            [$this->key, $this->depth, $this->receiptTaken] = $before;
        }
    }

    /**
     * The key the command running now is receipted under: the request's key for the outermost command, null for a
     * nested one or a request without a key.
     */
    public function keyOfCurrentCommand(): string|null
    {
        return $this->depth === 1 ? $this->key : null;
    }

    /**
     * Whether the command running now is the outermost one and the request carries no key for it.
     */
    public function isMissingForCurrentCommand(): bool
    {
        return $this->depth === 1 && $this->key === null;
    }
}
