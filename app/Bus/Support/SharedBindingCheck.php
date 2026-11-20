<?php

declare(strict_types=1);

namespace App\Bus\Support;

use Illuminate\Container\Attributes\Scoped;
use Illuminate\Container\Attributes\Singleton;
use Illuminate\Container\Container;
use ReflectionClass;
use RuntimeException;

/**
 * Refuses a handler or middleware class the container shares: each command builds its own, so none is kept.
 */
final readonly class SharedBindingCheck
{
    /**
     * @param  class-string  $class
     * @param  callable(string): RuntimeException  $refusal
     */
    public static function check(string $class, callable $refusal): void
    {
        $reflection = new ReflectionClass($class);

        if ($reflection->getAttributes(Singleton::class) !== []
            || $reflection->getAttributes(Scoped::class) !== []
            || Container::getInstance()->isShared($class)) {
            throw $refusal('it is kept between commands (Singleton, Scoped or shared); it is built fresh for each one');
        }
    }
}
