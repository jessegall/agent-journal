<?php

declare(strict_types=1);

namespace App\Exceptions\Concerns;

use App\Exceptions\Support\ThrowingCall;
use Throwable;

/**
 * Lets an exception be thrown later
 *
 * @template TException of Throwable
 */
trait ThrowsLater
{
    /**
     * A proxy whose next call is handed back as a closure that throws what the call makes.
     *
     * @return ThrowingCall<TException>|TException
     *
     * @phpstan-return ThrowingCall<TException>
     */
    public static function throwing(): ThrowingCall
    {
        return new ThrowingCall(static::class);
    }
}
