<?php

declare(strict_types=1);

namespace App\CommandMiddleware;

use App\Contracts\Bus\CommandMiddleware;
use App\Exceptions\ReadOnlyWriteRefused;
use App\Support\CommandCall;
use App\Support\ReadOnlyStretch;
use Closure;

/**
 * Refuses every command run while something only reads, a skill condition or a read tool, before anything is written.
 */
final readonly class RefuseWritesDuringReads implements CommandMiddleware
{
    public function __construct(
        private ReadOnlyStretch $stretch,
    ) {}

    public function handle(CommandCall $call, Closure $next): mixed
    {
        foreach ($this->stretch->reader() as $reader) {
            throw ReadOnlyWriteRefused::for($call->command::class, $reader);
        }

        return $next($call);
    }
}
