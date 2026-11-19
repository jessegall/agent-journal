<?php

declare(strict_types=1);

namespace App\Bus\CommandMiddleware;

use App\Bus\Contracts\CommandMiddleware;
use App\Bus\Support\CommandCall;
use App\Bus\Support\CommandRegistry;
use Closure;

/**
 * Lets a command run only with an actor, and only with the type of actor its RequiresActor names, before anything of
 * it can write. What the journal itself may run is decided by the command's entry, not here. Nested commands pass it
 * again.
 */
final readonly class CheckActor implements CommandMiddleware
{
    public function __construct(private CommandRegistry $registry) {}

    public function handle(CommandCall $call, Closure $next): mixed
    {
        $actor = $call->actor();
        $required = $this->registry->requiredActor($call->name());

        if ($required !== null && $actor->type !== $required) {
            throw $required->refusalFor($actor->type);
        }

        return $next($call);
    }
}
