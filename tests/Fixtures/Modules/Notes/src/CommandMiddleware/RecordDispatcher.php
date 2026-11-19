<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\CommandMiddleware;

use App\Bus\Contracts\CommandMiddleware;
use App\Bus\Support\CommandCall;
use Closure;
use Tests\Fixtures\Modules\Notes\Support\CommandTrail;

/**
 * Records who the command it passes on reports as its dispatcher, such as dispatched by user:1.
 */
final readonly class RecordDispatcher implements CommandMiddleware
{
    public function __construct(private CommandTrail $trail) {}

    public function handle(CommandCall $call, Closure $next): mixed
    {
        $dispatcher = $call->command()->dispatchedBy();
        $this->trail->add("dispatched by {$dispatcher->type->value}:{$dispatcher->id}");

        return $next($call);
    }
}
