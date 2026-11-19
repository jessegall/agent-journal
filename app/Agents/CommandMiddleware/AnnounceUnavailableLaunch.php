<?php

declare(strict_types=1);

namespace App\Agents\CommandMiddleware;

use App\Agents\Contracts\LaunchesAgent;
use App\Agents\Events\LaunchUnavailable;
use App\Agents\Exceptions\AccountUnavailable;
use App\Bus\Contracts\CommandMiddleware;
use App\Bus\Support\CommandCall;
use Closure;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Around a launch's transaction: when no account can run it, the refusal rolls the launch back and this announces
 * the program and the safe reason, so the owner hears of it while the agent's work stays as it was.
 */
final readonly class AnnounceUnavailableLaunch implements CommandMiddleware
{
    public function __construct(private Dispatcher $events) {}

    public function handle(CommandCall $call, Closure $next): mixed
    {
        try {
            return $next($call);
        } catch (AccountUnavailable $refused) {
            $command = $call->command();

            if ($command instanceof LaunchesAgent) {
                $this->events->dispatch(
                    new LaunchUnavailable($command->launchedAgentId(), $refused->program, $refused->reason),
                );
            }

            throw $refused;
        }
    }
}
