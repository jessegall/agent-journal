<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\CommandMiddleware;

use App\Bus\CommandCall;
use App\Bus\Contracts\CommandMiddleware;
use Closure;

/**
 * Misbehaves: returns without running the command.
 */
final readonly class SkipsCommand implements CommandMiddleware
{
    public function handle(CommandCall $call, Closure $next): mixed
    {
        return null;
    }
}
