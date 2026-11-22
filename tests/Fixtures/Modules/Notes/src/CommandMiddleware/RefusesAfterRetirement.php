<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\CommandMiddleware;

use App\Contracts\Bus\CommandMiddleware;
use App\Exceptions\CommandRefused;
use App\Support\CommandCall;
use Closure;

/**
 * Refuses after the handler has returned, inside the transaction, so everything the command wrote rolls back (story
 * 37).
 */
final readonly class RefusesAfterRetirement implements CommandMiddleware
{
    public function handle(CommandCall $call, Closure $next): mixed
    {
        $next($call);

        throw CommandRefused::because('Notes refuses this retirement after the fact.');
    }
}
