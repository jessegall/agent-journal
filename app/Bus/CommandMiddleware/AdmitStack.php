<?php

declare(strict_types=1);

namespace App\Bus\CommandMiddleware;

use App\Bus\Contracts\CommandMiddleware;
use App\Bus\Contracts\StackAdmission;
use App\Bus\Support\CommandCall;
use App\Bus\Support\OperationDeadline;
use Closure;

/**
 * Admits a command of a signed agent to its own session's stack before any transaction starts, so the operations on
 * one stack run one after another; a nested command joins the admission of its outer one.
 */
final readonly class AdmitStack implements CommandMiddleware
{
    public function __construct(private StackAdmission $admission, private OperationDeadline $deadline) {}

    public function handle(CommandCall $call, Closure $next): mixed
    {
        return $this->admission->admitCaller($this->deadline, fn (): mixed => $next($call));
    }
}
