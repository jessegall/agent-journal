<?php

declare(strict_types=1);

namespace App\CommandMiddleware;

use App\Agents\Drivers\Work\WorkerLease;
use App\Contracts\Bus\CommandMiddleware;
use App\Models\Hosts\HostProcess;
use App\Support\CommandCall;
use App\Support\CommandNesting;
use Closure;

/**
 * A command a driver worker runs goes through only while that worker still holds its process, checked in the
 * command's own transaction: a deposed worker records nothing, no turn, cost or usage, and makes no order.
 */
final readonly class FenceDriverWorker implements CommandMiddleware
{
    public function __construct(private WorkerLease $lease, private CommandNesting $nesting) {}

    public function handle(CommandCall $call, Closure $next): mixed
    {
        $processId = $this->lease->processId();

        if ($processId !== null && ! $this->nesting->isNested()) {
            HostProcess::findLocked($processId)->assertWorker($this->lease->generation());
        }

        return $next($call);
    }
}
