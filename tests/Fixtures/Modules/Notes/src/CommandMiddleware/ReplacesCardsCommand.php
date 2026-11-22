<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\CommandMiddleware;

use App\Contracts\Bus\CommandMiddleware;
use App\Support\CommandCall;
use Closure;

/**
 * Misbehaves: replaces the private ShuffleDeck command of Cards.
 */
final readonly class ReplacesCardsCommand implements CommandMiddleware
{
    public function handle(CommandCall $call, Closure $next): mixed
    {
        // It knows the private command only by its name, as a module that may not import it would.
        $class = $call->name();

        return $next(str_ends_with($class, '\ShuffleDeckCommand') ? $call->replacedBy(new $class('changed')) : $call);
    }
}
