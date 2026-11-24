<?php

declare(strict_types=1);

namespace App\Support;

use Closure;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;
use Throwable;

/**
 * A keyed store: each item kept under its key, a missing key refused with the owner's own named exception, and, when
 * the owner refuses repeats, a key put twice refused with its own named exception too.
 *
 * @template TItem
 */
final class Registry
{
    /**
     * @var array<string, TItem>
     */
    private array $registrations = [];

    /**
     * @param  Closure(string): Throwable  $missing
     * @param  Option<Closure(string): Throwable>  $repeated
     */
    private function __construct(private readonly Closure $missing, private readonly Option $repeated) {}

    /**
     * A store whose every key is put once; a second put of a key is refused.
     *
     * @param  Closure(string): Throwable  $missing
     * @param  Closure(string): Throwable  $repeated
     * @return self<mixed>
     */
    public static function once(Closure $missing, Closure $repeated): self
    {
        return new self($missing, new Some($repeated));
    }

    /**
     * A store where a key put again holds the newer item.
     *
     * @param  Closure(string): Throwable  $missing
     * @return self<mixed>
     */
    public static function replacing(Closure $missing): self
    {
        return new self($missing, None::create());
    }

    /**
     * @param  TItem  $registration
     *
     * @throws Throwable
     */
    public function put(string $key, mixed $registration): void
    {
        if ($this->has($key) && $this->repeated->isDefined()) {
            throw ($this->repeated->get())($key);
        }

        $this->registrations[$key] = $registration;
    }

    public function has(string $key): bool
    {
        return array_key_exists($key, $this->registrations);
    }

    /**
     * @return TItem
     *
     * @throws Throwable
     */
    public function get(string $key): mixed
    {
        if (! $this->has($key)) {
            throw ($this->missing)($key);
        }

        return $this->registrations[$key];
    }

    /**
     * @return Option<TItem>
     */
    public function find(string $key): Option
    {
        if ($this->has($key)) {
            return new Some($this->registrations[$key]);
        }

        return None::create();
    }

    /**
     * @return array<string, TItem>
     */
    public function all(): array
    {
        return $this->registrations;
    }

    /**
     * @return list<string>
     */
    public function keys(): array
    {
        return array_map(strval(...), array_keys($this->registrations));
    }

    public function remove(string $key): void
    {
        unset($this->registrations[$key]);
    }

    public function clear(): void
    {
        $this->registrations = [];
    }
}
