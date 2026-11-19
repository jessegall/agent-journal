<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\CommandMiddleware;

use App\Bus\Contracts\CommandMiddleware;
use App\Bus\Support\CommandCall;
use Closure;

/**
 * Misbehaves: replaces the private FinishTask command of Tasks.
 */
final readonly class ReplacesTasksCommand implements CommandMiddleware
{
    public function handle(CommandCall $call, Closure $next): mixed
    {
        // It knows the private command only by its name, as a module that may not import it would.
        $class = $call->name();

        return $next(
str_ends_with($class, '\\FinishTask') ? $call->replacedBy(
new $class('01jd8x0g9m3qz6v4k2t7r00000', 0, 'Replaced.'),
) : $call,
);
    }
}
