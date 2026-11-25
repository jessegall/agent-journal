<?php

declare(strict_types=1);

namespace App\Exceptions\Concerns;

use App\Exceptions\Support\ThrowingCall;
use Throwable;

/**
 * Lets an exception be thrown later: TaskMissing::throwing()->forId($id) is a closure that makes the exception with
 * forId($id) and throws it, for a read that fails with it, such as ->firstOr(TaskMissing::throwing()->forId($id)).
 * The exception names itself: @use ThrowsLater<TaskMissing>.
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
