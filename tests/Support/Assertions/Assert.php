<?php

declare(strict_types=1);

namespace Tests\Support\Assertions;

use BackedEnum;
use Closure;
use PHPUnit\Framework\Assert as PHPUnit;
use Tests\Support\Assertions\Contracts\Facts;
use UnitEnum;

/**
 * The facts of one subject under its path, asserted as Inertia asserts a page's props: where, has, count and missing
 * each touch a fact, and a scoped subject fails on a fact nobody touched unless its scope ends in etc().
 */
class Assert
{
    /**
     * @var array<string|int, mixed>|null the subject's facts, opened at the first assertion
     */
    private array|null $opened = null;

    /**
     * @var array<string|int, true> the keys an assertion touched
     */
    private array $touched = [];

    private bool $allowsUntouched = false;

    /**
     * @param  Facts|array<string|int, mixed>  $facts
     */
    protected function __construct(
        private readonly Facts|array $facts,
        private readonly string $path,
        private readonly bool $isScope,
    ) {}

    /**
     * The journal's own facts, the root of every assertion: a fact a test does not touch there passes.
     */
    public static function root(Facts $facts): self
    {
        return new self($facts, '', false);
    }

    /**
     * The fact at the key holds the value, or passes the check given.
     *
     * @param  mixed|(Closure(mixed): bool)  $expected
     */
    public function where(string $key, mixed $expected): static
    {
        $this->touch($key);
        $actual = $this->value($key);

        if ($expected instanceof Closure) {
            PHPUnit::assertTrue(
                $expected($actual),
                "{$this->pathOf($key)}: the check refused {$this->describe($actual)}.",
            );

            return $this;
        }

        $message = "{$this->pathOf($key)}: expected {$this->describe($expected)}, got {$this->describe($actual)}.";

        if (is_object($expected) && ! $expected instanceof UnitEnum) {
            PHPUnit::assertEquals($expected, $actual, $message);

            return $this;
        }

        PHPUnit::assertSame($expected, $actual, $message);

        return $this;
    }

    /**
     * The fact at the key is there; with a scope, the scope asserts the subject the fact holds, and fails on a fact of
     * it nobody touched. The scope is optional as in Inertia's has(), the one exception to one behaviour per method.
     *
     * @param  (Closure(Assert): mixed)|null  $scope
     */
    public function has(string $key, Closure|null $scope = null): static
    {
        $this->touch($key);
        $value = $this->value($key);
        PHPUnit::assertNotNull($value, "{$this->pathOf($key)}: the fact is empty.");

        if ($scope !== null) {
            $this->scope($key, $value, $scope);
        }

        return $this;
    }

    /**
     * The fact at the key holds the number of items; with a scope, the scope asserts the first of them.
     *
     * @param  (Closure(Assert): mixed)|null  $scope
     */
    public function count(string $key, int $count, Closure|null $scope = null): static
    {
        $this->touch($key);
        $items = self::open($this->value($key));
        PHPUnit::assertIsArray($items, "{$this->pathOf($key)}: the fact holds no list.");
        PHPUnit::assertCount($count, $items, "{$this->pathOf($key)}: expected {$count} items, got ".count($items).'.');

        if ($scope !== null && $items !== []) {
            $first = array_key_first($items);
            $this->scope("{$key}.{$first}", $items[$first], $scope);
        }

        return $this;
    }

    /**
     * The fact at the key is not there, or is empty.
     */
    public function missing(string $key): static
    {
        $this->touch($key);

        if (! $this->holds($key)) {
            return $this;
        }

        $value = $this->value($key);
        PHPUnit::assertNull($value, "{$this->pathOf($key)}: expected nothing, got {$this->describe($value)}.");

        return $this;
    }

    /**
     * The facts this scope did not touch pass.
     */
    public function etc(): static
    {
        $this->allowsUntouched = true;

        return $this;
    }

    /**
     * The fact at the dotted key, read without counting as an assertion, to compare it with another.
     */
    public function value(string $key): mixed
    {
        $value = $this->opened();
        $walked = $this->path;

        foreach (explode('.', $key) as $segment) {
            $facts = self::open($value);
            $walked = $walked === '' ? $segment : "{$walked}.{$segment}";

            if (! is_array($facts) || ! array_key_exists($segment, $facts)) {
                PHPUnit::fail("{$walked}: no such fact; there are ".self::keysOf($facts).'.');
            }

            $value = $facts[$segment];
        }

        return self::resolved($value);
    }

    /**
     * Fails a scope on each fact nobody touched, unless the scope ended in etc(); the root passes them.
     */
    private function interacted(): void
    {
        if (! $this->isScope || $this->allowsUntouched) {
            return;
        }

        $untouched = array_values(array_diff(array_map('strval', array_keys($this->opened())), array_map(
            'strval',
            array_keys($this->touched),
        )));

        PHPUnit::assertSame(
            [],
            $untouched,
            "{$this->path}: the facts ".implode(', ', $untouched).' are not asserted; assert them or end with etc().',
        );
    }

    /**
     * Whether the dotted key names a fact, read without counting as an assertion.
     */
    protected function holds(string $key): bool
    {
        $value = $this->opened();

        foreach (explode('.', $key) as $segment) {
            $facts = self::open($value);

            if (! is_array($facts) || ! array_key_exists($segment, $facts)) {
                return false;
            }

            $value = $facts[$segment];
        }

        return true;
    }

    /**
     * @param  Closure(Assert): mixed  $scope
     */
    private function scope(string $key, mixed $value, Closure $scope): void
    {
        $facts = self::open($value);
        PHPUnit::assertIsArray($facts, "{$this->pathOf($key)}: the fact is no subject to scope into.");
        $inner = new self($facts, $this->pathOf($key), true);
        $scope($inner);
        $inner->interacted();
    }

    private function touch(string $key): void
    {
        $this->touched[explode('.', $key)[0]] = true;
    }

    /**
     * @return array<string|int, mixed>
     */
    private function opened(): array
    {
        return $this->opened ??= $this->facts instanceof Facts ? $this->facts->facts() : $this->facts;
    }

    private function pathOf(string $key): string
    {
        return $this->path === '' ? $key : "{$this->path}.{$key}";
    }

    /**
     * A fact read to its value: a closure is called, another subject's facts are opened.
     */
    private static function resolved(mixed $value): mixed
    {
        while ($value instanceof Closure) {
            $value = $value();
        }

        return $value;
    }

    /**
     * A value as a map of facts to walk into: another subject's facts opened, a list or map as it is.
     */
    private static function open(mixed $value): mixed
    {
        $value = self::resolved($value);

        return $value instanceof Facts ? $value->facts() : $value;
    }

    private static function keysOf(mixed $facts): string
    {
        if (! is_array($facts) || $facts === []) {
            return 'none';
        }

        return implode(', ', array_map('strval', array_keys($facts)));
    }

    private function describe(mixed $value): string
    {
        $value = self::open($value);

        return match (true) {
            $value instanceof BackedEnum => (string) $value->value,
            $value instanceof UnitEnum => $value->name,
            is_object($value) => $value::class,
            default => json_encode($value, JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE) ?: 'a value',
        };
    }
}
