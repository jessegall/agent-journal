<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Cards\CommandMiddleware;

use App\Bus\CommandCall;
use App\Bus\Contracts\CommandMiddleware;
use Closure;
use Tests\Fixtures\Modules\Notes\Support\CommandTrail;

/**
 * Records every command before its transaction, for the owner order.
 */
final readonly class RecordCards implements CommandMiddleware
{
    public function __construct(private CommandTrail $trail) {}

    public function handle(CommandCall $call, Closure $next): mixed
    {
        $this->trail->add('cards around all');

        return $next($call);
    }
}
