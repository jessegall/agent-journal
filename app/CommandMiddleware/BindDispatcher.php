<?php

declare(strict_types=1);

namespace App\CommandMiddleware;

use App\Contracts\Actors\CurrentActor;
use App\Contracts\Bus\CommandMiddleware;
use App\Support\CommandCall;
use Closure;

/**
 * Binds the actor of this request to the command as its dispatcher, so a handler reads who dispatched it from the
 * command; a call without an actor is refused here, before the stack is admitted.
 */
final readonly class BindDispatcher implements CommandMiddleware
{
    public function __construct(private CurrentActor $actors) {}

    public function handle(CommandCall $call, Closure $next): mixed
    {
        return $next($call->withDispatcher($this->actors->actor()));
    }
}
