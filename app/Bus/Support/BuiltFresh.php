<?php

declare(strict_types=1);

namespace App\Bus\Support;

use Illuminate\Container\Attributes\Scoped;
use Illuminate\Container\Attributes\Singleton;
use Illuminate\Container\Container;
use ReflectionClass;
use RuntimeException;

/**
 * Handlers and middleware are built fresh for each command, so none may be kept between requests.
 */
final readonly class BuiltFresh
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
