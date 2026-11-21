<?php

declare(strict_types=1);

namespace Tests\Fixtures\StaticFactories;

use App\Reflection\Exceptions\ClassMissing;
use App\Reflection\Support\Reflector;
use Carbon\CarbonImmutable;

/**
 * The planted shapes of StaticFactoryScanTest: a repeated factory call, look-alikes it leaves alone, and static
 * Reflector calls inside and outside a class the container builds.
 */
final class StaticFactoryUses
{
    public function __construct(private readonly string $name) {}

    public function repeats(): bool
    {
        $first = Reflector::of($this->name);

        return Reflector::of($this->name)->isFinal() && $first->isFinal();
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

    public static function helper(string $name): bool
    {
        if ($name === '') {
            throw ClassMissing::for($name);
        }

        return Reflector::exists($name) || throw ClassMissing::for($name);
    }
}
