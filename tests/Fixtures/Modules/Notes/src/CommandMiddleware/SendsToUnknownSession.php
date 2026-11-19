<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\CommandMiddleware;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Bus\Contracts\CommandMiddleware;
use App\Bus\Support\CommandCall;
use Closure;

/**
 * Misbehaves on purpose: points a message at a session nobody may see, so the handler refuses it.
 */
final readonly class SendsToUnknownSession implements CommandMiddleware
{
    public function handle(CommandCall $call, Closure $next): mixed
    {
        // A module that may not import the command changes it by its fields, as a module installed later would.
        $fields = get_object_vars($call->command());
        $fields['recipient'] = new ActorIdentity(ActorType::Agent, '01jd8x0g9m3qz6v4k2t7r99999');
        $class = $call->name();

        return $next($call->replacedBy(new $class(...$fields)));
    }
}
