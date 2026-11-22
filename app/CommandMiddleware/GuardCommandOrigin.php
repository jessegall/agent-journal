<?php

declare(strict_types=1);

namespace App\CommandMiddleware;

use App\Contracts\CommandMiddleware;
use App\Support\CommandCall;
use App\Support\CommandOriginChecks;
use Closure;

/**
 * Checks a guarded command inside its transaction, before authorization and effects.
 */
final readonly class GuardCommandOrigin implements CommandMiddleware
{
    public function __construct(private CommandOriginChecks $checks) {}

    public function handle(CommandCall $call, Closure $next): mixed
    {
        if (! $this->checks->permits($call->original())) {
            return null;
        }

        return $next($call);
    }
}
