<?php

declare(strict_types=1);

namespace App\Bus\CommandMiddleware;

use App\Access\Contracts\StackAdmission;
use App\Bus\CommandCall;
use App\Bus\Contracts\CommandMiddleware;
use App\Support\StackOperationDeadline;
use Closure;

/**
 * Admits a command of a signed agent to its own session's stack before any transaction starts, so the operations on
 * one stack run one after another; a nested command joins the admission of its outer one.
 */
final readonly class AdmitStack implements CommandMiddleware
{
    public function __construct(private StackAdmission $admission, private StackOperationDeadline $deadline) {}

    public function handle(CommandCall $call, Closure $next): mixed
    {
        return $this->admission->admitCaller($this->deadline, fn (): mixed => $next($call));
    }
}
