<?php

declare(strict_types=1);

namespace App\Contracts\Bus;

use App\Support\CommandCall;
use Closure;

/**
 * A step every command passes before its handler: it may look at the call, replace the command with a changed copy of
 * the same class, refuse it, or see the result, and it calls the next step once.
 */
interface CommandMiddleware
{
    /**
     * @param  Closure(CommandCall): mixed  $next
     */
    public function handle(CommandCall $call, Closure $next): mixed;
}
