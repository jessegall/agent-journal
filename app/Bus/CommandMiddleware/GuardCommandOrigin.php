<?php

declare(strict_types=1);

namespace App\Bus\CommandMiddleware;

use App\Bus\Contracts\CommandMiddleware;
use App\Bus\Support\CommandCall;
use App\Bus\Support\CommandOriginChecks;
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
