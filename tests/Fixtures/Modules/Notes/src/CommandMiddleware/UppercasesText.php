<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\CommandMiddleware;

use App\Contracts\CommandMiddleware;
use App\Support\CommandCall;
use Closure;
use Tests\Fixtures\Modules\Notes\Commands\WriteNote\WriteNoteCommand;

/**
 * Replaces WriteNoteCommand with a copy whose text is in capitals.
 */
final readonly class UppercasesText implements CommandMiddleware
{
    public function handle(CommandCall $call, Closure $next): mixed
    {
        $command = $call->command();

        return $next(
$command instanceof WriteNoteCommand ? $call->replacedBy(new WriteNoteCommand(strtoupper($command->text))) : $call,
);
    }
}
