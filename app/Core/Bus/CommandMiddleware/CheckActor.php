<?php

declare(strict_types=1);

namespace App\Core\Bus\CommandMiddleware;

use App\Core\Actors\Enums\ActorType;
use App\Core\Actors\Exceptions\ActorContextMissing;
use App\Core\Actors\Exceptions\AgentActorRequired;
use App\Core\Actors\Exceptions\UserActorRequired;
use App\Core\Bus\Contracts\CommandMiddleware;
use App\Core\Bus\Support\CommandCall;
use App\Core\Bus\Support\CommandRegistry;
use Closure;

/**
 * Lets a command run only with an actor, and only with the type of actor its RequiresActor names, before anything of
 * it can write.
 */
final readonly class CheckActor implements CommandMiddleware
{
    public function __construct(private CommandRegistry $registry) {}

    public function handle(CommandCall $call, Closure $next): mixed
    {
        $actor = $call->actor() ?? throw ActorContextMissing::forRequest();
        $required = $this->registry->requiredActor($call->name());

        if ($required !== null && $actor->type !== $required) {
            throw $required === ActorType::User ? UserActorRequired::forActor($actor->type->value) : AgentActorRequired::forActor($actor->type->value);
        }

        return $next($call);
    }
}
