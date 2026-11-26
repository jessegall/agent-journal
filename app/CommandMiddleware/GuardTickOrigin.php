<?php

declare(strict_types=1);

namespace App\CommandMiddleware;

use App\Bus\CommandCall;
use App\Bus\Contracts\CommandMiddleware;
use App\Engine\TickOrigins;
use Closure;

/**
 * Inside the command's transaction and before its handler, a command a tick produced takes the locks of its origin and
 * of the subjects it declared, in order, and checks their work is still live; the locks are held until it commits, and
 * a retried attempt checks again first.
 */
final readonly class GuardTickOrigin implements CommandMiddleware
{
    public function __construct(private TickOrigins $origins) {}

    public function handle(CommandCall $call, Closure $next): mixed
    {
        $this->origins->lockFor($call->command());

        return $next($call);
    }
}
