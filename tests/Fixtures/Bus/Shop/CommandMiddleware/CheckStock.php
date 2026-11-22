<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\CommandMiddleware;

use App\Contracts\Bus\CommandMiddleware;
use App\Support\CommandCall;
use Closure;

final class CheckStock implements CommandMiddleware
{
    public function handle(CommandCall $call, Closure $next): mixed
    {
        return $next($call);
    }
}
