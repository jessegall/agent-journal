<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\CommandMiddleware;

use App\Core\Bus\Contracts\CommandMiddleware;
use App\Core\Bus\Support\CommandCall;
use Closure;

final class LogShop implements CommandMiddleware
{
    public function handle(CommandCall $call, Closure $next): mixed
    {
        return $next($call);
    }
}
