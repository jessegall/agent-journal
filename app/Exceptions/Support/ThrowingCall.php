<?php

declare(strict_types=1);

namespace App\Exceptions\Support;

use Closure;
use Throwable;

/**
 * The higher-order proxy of ThrowsLater: a call on it is not made, but handed back as a closure that makes the
 * exception with the named factory and its arguments and throws it.
 *
 * @template TException of Throwable
 *
 * @mixin TException
 */
final readonly class ThrowingCall
{
    /**
     * @param  class-string<TException>  $exception
     */
    public function __construct(private string $exception) {}

    /**
     * The closure that throws what the factory makes from the arguments.
     *
     * @param  list<mixed>  $arguments
     * @return Closure(): never
     */
    public function __call(string $factory, array $arguments): Closure
    {
        $exception = $this->exception;

        return static function () use ($exception, $factory, $arguments): never {
            throw $exception::$factory(...$arguments);
        };
    }
}
