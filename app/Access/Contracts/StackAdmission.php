<?php

declare(strict_types=1);

namespace App\Access\Contracts;

use App\Access\Exceptions\StackLockTimedOut;
use App\Support\OperationDeadline;
use Closure;

/**
 * Lets one operation at a time work on an agent session's stack: it is admitted before its transaction starts, waits
 * within its deadline, and is released when the work ends, however it ends. Work already admitted for the session
 * joins that admission.
 */
interface StackAdmission
{
    /**
     * Runs the work admitted to the session's stack.
     *
     * @template TResult
     *
     * @param  Closure(): TResult  $work
     * @return TResult
     *
     * @throws StackLockTimedOut when the stack stays held past the deadline's lock wait
     */
    public function admit(string $sessionId, OperationDeadline $deadline, Closure $work): mixed;

    /**
     * Runs the work admitted to the calling agent session's stack; work of any other caller runs as it is.
     *
     * @template TResult
     *
     * @param  Closure(): TResult  $work
     * @return TResult
     *
     * @throws StackLockTimedOut
     */
    public function admitCaller(OperationDeadline $deadline, Closure $work): mixed;
}
