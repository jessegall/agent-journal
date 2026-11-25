<?php

declare(strict_types=1);

namespace App\Contracts\Bus;

use App\Support\CommandCall;
use Closure;

/**
 * Where a command ends once it passed every middleware: the handler in production, a recording sink in a test.
 */
interface CommandEnd
{
    /**
     * @param  Closure(Command<mixed>): mixed  $handler  Laravel's continuation, which calls the handler
     */
    public function finish(CommandCall $call, Closure $handler): mixed;
}
