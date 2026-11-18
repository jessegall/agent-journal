<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Garden\CommandMiddleware;

use App\Bus\Contracts\CommandMiddleware;
use App\Bus\Support\CommandCall;
use Closure;

final class Fence implements CommandMiddleware
{
    public function handle(CommandCall $call, Closure $next): mixed
    {
        return $next($call);
    }
}
