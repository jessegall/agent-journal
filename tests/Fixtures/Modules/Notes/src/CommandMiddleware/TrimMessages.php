<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\CommandMiddleware;

use App\Contracts\CommandMiddleware;
use App\Support\CommandCall;
use Closure;

/**
 * Trims the body of every message sent, before Chat saves it (doc 19, section 7.6).
 */
final readonly class TrimMessages implements CommandMiddleware
{
    public function handle(CommandCall $call, Closure $next): mixed
    {
        // A module that may not import the command changes it by its fields, as a module installed later would.
        $fields = get_object_vars($call->command());
        $fields['body'] = trim((string) $fields['body']);
        $class = $call->name();

        return $next($call->replacedBy(new $class(...$fields)));
    }
}
