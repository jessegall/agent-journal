<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\ClaimLaunchGrant;
use App\Agents\Events\LaunchGrantRequested;
use App\Agents\Support\HostRuntimes;
use App\Agents\Support\LaunchAdditions;
use App\Agents\Support\LaunchGrant;
use App\Contracts\CommandHandler;
use Illuminate\Contracts\Events\Dispatcher;

final readonly class ClaimLaunchGrantHandler implements CommandHandler
{
    public function __construct(
        private HostRuntimes $runtimes,
        private Dispatcher $events,
    ) {}

    /**
     * The grant once, with what the other areas add to the launch; a listener's refusal rolls the claim back, so the
     * host may ask again once the launch is ready.
     */
    public function handle(ClaimLaunchGrant $command): LaunchGrant|null
    {
        $runtime = $this->runtimes->lockedFor($command->hostId, $command->runtimeId);
        $token = $runtime->claimLaunchGrant();

        if ($token === null) {
            return null;
        }

        $additions = new LaunchAdditions();
        $this->events->dispatch(new LaunchGrantRequested($runtime->agent_session_id, $additions));

        return new LaunchGrant($token, $additions->folders());
    }
}
