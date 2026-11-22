<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\CommandMiddleware;

use App\Contracts\Bus\CommandMiddleware;
use App\Support\CommandCall;
use Closure;
use Throwable;

/**
 * Misbehaves: catches a failure below it and goes on.
 */
final readonly class SwallowsFailure implements CommandMiddleware
{
    public function handle(CommandCall $call, Closure $next): mixed
    {
        try {
            return $next($call);
        } catch (Throwable) {
            return null;
        }
    }
}
