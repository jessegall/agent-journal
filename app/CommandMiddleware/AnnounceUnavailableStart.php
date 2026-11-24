<?php

declare(strict_types=1);

namespace App\CommandMiddleware;

use App\Contracts\Bus\AgentStartCommand;
use App\Contracts\Bus\CommandMiddleware;
use App\Events\StartRefusedWithoutAccount;
use App\Exceptions\AccountUnavailable;
use App\Support\CommandCall;
use Closure;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Around a start's transaction: when no account can run it, the refusal rolls the start back and this announces
 * the driver and the safe reason, so the owner is told while the agent's work stays as it was.
 */
final readonly class AnnounceUnavailableStart implements CommandMiddleware
{
    public function __construct(private Dispatcher $events) {}

    public function handle(CommandCall $call, Closure $next): mixed
    {
        try {
            return $next($call);
        } catch (AccountUnavailable $refused) {
            $command = $call->command();

            if ($command instanceof AgentStartCommand) {
                $this->events->dispatch(
                    new StartRefusedWithoutAccount($command->startedAgentId(), $refused->driver, $refused->reason),
                );
            }

            throw $refused;
        }
    }
}
