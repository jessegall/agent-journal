<?php

declare(strict_types=1);

namespace Tests\Fixtures\StaticFactories;

use App\Exceptions\ClassMissing;
use App\Support\ReflectedType;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Container\Container;

/**
 * The planted shapes of StaticFactoryScanTest: a repeated factory call, look-alikes it leaves alone, static
 * ReflectedType calls inside and outside a class the container builds, and a value object that keeps its static call.
 */
final class StaticFactoryUses
{
    public function __construct(private readonly Container $container, private readonly string $name) {}

    public function repeats(): bool
    {
        $first = ReflectedType::of($this->name);

        return ReflectedType::of($this->name)->isFinal() && $first->isFinal();
    }

    public function differs(): bool
    {
        $today = CarbonImmutable::parse('today');
        $tomorrow = CarbonImmutable::parse('tomorrow');
        $now = CarbonImmutable::now();
        $later = CarbonImmutable::now();
        $named = CarbonImmutable::create(year: 2026);
        $other = CarbonImmutable::create(month: 2026);
        $nested = fn () => CarbonImmutable::parse('today');
        $parsers = [CarbonImmutable::parse(...), CarbonImmutable::parse(...)];

        return $today < $tomorrow && $now <= $later && $named != $other && $nested !== null && $parsers !== [];
    }

    public static function isHelper(string $name): bool
    {
        if ($name === '') {
            throw ClassMissing::for($name);
        }

        return ReflectedType::exists($name) || throw ClassMissing::for($name);
    }
}

/**
 * A value object made with new: its public data and no hidden service, so its static ReflectedType call stays.
 */
final readonly class StaticFactoryValue
{
    public function __construct(public string $name) {}

    public function isFinal(): bool
    {
        return ReflectedType::of($this->name)->isFinal();
    }
}
