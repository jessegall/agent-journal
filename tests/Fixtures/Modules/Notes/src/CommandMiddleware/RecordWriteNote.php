<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\CommandMiddleware;

use App\Bus\CommandCall;
use App\Bus\Contracts\CommandMiddleware;
use Closure;
use Tests\Fixtures\Modules\Notes\Support\CommandStepLog;

/**
 * Records WriteNote before its transaction.
 */
final readonly class RecordWriteNote implements CommandMiddleware
{
    public function __construct(private CommandStepLog $steps) {}

    public function handle(CommandCall $call, Closure $next): mixed
    {
        $this->steps->add('notes around write');

        return $next($call);
    }
}
