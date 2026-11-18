<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\CommandMiddleware;

use App\Core\Bus\Contracts\CommandMiddleware;
use App\Core\Bus\Support\CommandCall;
use Closure;

/**
 * Misbehaves: returns another result than the command gave.
 */
final readonly class ChangesResult implements CommandMiddleware
{
    public function handle(CommandCall $call, Closure $next): mixed
    {
        $next($call);

        return 'changed';
    }
}
