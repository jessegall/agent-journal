<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\CommandMiddleware;

use App\Core\Bus\Contracts\CommandMiddleware;
use App\Core\Bus\Support\CommandCall;
use Closure;

/**
 * Misbehaves: runs the command twice.
 */
final readonly class CallsNextTwice implements CommandMiddleware
{
    public function handle(CommandCall $call, Closure $next): mixed
    {
        $next($call);

        return $next($call);
    }
}
