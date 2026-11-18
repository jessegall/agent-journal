<?php

declare(strict_types=1);

namespace App\Bus\Support;

use App\Bus\Exceptions\RequestKeyInvalid;
use Closure;
use Illuminate\Container\Attributes\Scoped;

/**
 * The request key of this request's write, set by the transport that received it, and which command dispatch is the
 * outermost one: only that one is receipted under the key. Scoped, so the next request starts with none.
 */
#[Scoped]
final class RequestKey
{
    public const int LONGEST = 128;

    private const string FORM = '/^[A-Za-z0-9-]+$/';

    private string|null $key = null;

    private int $depth = 0;

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
     * The key of this request's write, or null when the call carries none.
     */
    public function key(): string|null
    {
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
     * The key the command running now is receipted under: the request's key for the outermost command, null for a
     * nested one or a request without a key.
     */
    public function keyOfCurrentCommand(): string|null
    {
        return $this->depth === 1 ? $this->key : null;
    }
}
