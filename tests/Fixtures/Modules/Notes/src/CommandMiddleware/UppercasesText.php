<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\CommandMiddleware;

use App\Bus\Contracts\CommandMiddleware;
use App\Bus\Support\CommandCall;
use Closure;
use Tests\Fixtures\Modules\Notes\Commands\WriteNote;

/**
 * Replaces WriteNote with a copy whose text is in capitals.
 */
final readonly class UppercasesText implements CommandMiddleware
{
    public function handle(CommandCall $call, Closure $next): mixed
    {
        $command = $call->command();

        return $next(
$command instanceof WriteNote ? $call->replacedBy(new WriteNote(strtoupper($command->text))) : $call,
);
    }
}
