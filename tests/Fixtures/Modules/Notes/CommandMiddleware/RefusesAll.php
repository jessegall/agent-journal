<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\CommandMiddleware;

use App\Bus\Contracts\CommandMiddleware;
use App\Bus\Exceptions\CommandRefused;
use App\Bus\Support\CommandCall;
use Closure;

/**
 * Refuses every command it sees, before anything is written.
 */
final readonly class RefusesAll implements CommandMiddleware
{
    public function handle(CommandCall $call, Closure $next): mixed
    {
        throw CommandRefused::because('Refused by the test middleware.');
    }
}
