<?php

declare(strict_types=1);

namespace App\Bus\CommandMiddleware;

use App\Actors\Enums\ActorType;
use App\Actors\Exceptions\ActorContextMissing;
use App\Actors\Exceptions\SystemNotAllowed;
use App\Bus\Contracts\CommandMiddleware;
use App\Bus\Exceptions\EngineNotAllowed;
use App\Bus\Support\CommandCall;
use App\Bus\Support\CommandRegistry;
use Closure;

/**
 * Lets a command run only with an actor, only with the type of actor its RequiresActor names, and with the engine only
 * when it declares AllowsEngine, before anything of it can write. The system runs only a command that names it; a
 * command naming no type takes users and agents. Nested commands pass it again.
 */
final readonly class CheckActor implements CommandMiddleware
{
    public function __construct(private CommandRegistry $registry) {}

    public function handle(CommandCall $call, Closure $next): mixed
    {
        $actor = $call->actor() ?? throw ActorContextMissing::forRequest();
        $required = $this->registry->requiredActor($call->name());

        if ($actor->type === ActorType::System && $required !== ActorType::System) {
            throw SystemNotAllowed::forCommand($call->name());
        }

        if ($actor->type === ActorType::Engine && ! $this->registry->allowsEngine($call->name())) {
            throw EngineNotAllowed::forCommand($call->name());
        }

        if ($required !== null && $actor->type !== $required) {
            throw $required->refusalFor($actor->type);
        }

        return $next($call);
    }
}
