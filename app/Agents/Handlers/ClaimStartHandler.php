<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\ClaimStart;
use App\Agents\Events\AccountSettingsRequested;
use App\Agents\Models\AgentSession;
use App\Agents\Models\ProcessStart;
use App\Agents\Support\AccountLaunchSettings;
use App\Agents\Support\ClaimedStart;
use App\Contracts\CommandHandler;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Hands the host a pending start with the recipe the program's adapter checked; when the adapter refuses the program's
 * build or arrangement, the claim rolls back and the start stays pending.
 */
final readonly class ClaimStartHandler implements CommandHandler
{
    public function __construct(private Dispatcher $events) {}

    public function handle(ClaimStart $command): ClaimedStart|null
    {
        $start = ProcessStart::claimFor($command->hostId, $command->sessionId);

        if ($start === null) {
            return null;
        }

        $program = AgentSession::query()->findOrFail($start->session_id)->selection()->program->value;
        $settings = new AccountLaunchSettings();
        $this->events->dispatch(new AccountSettingsRequested($program, $start->directory, $settings));

        return new ClaimedStart(
            $start->start_key,
            $start->session_id,
            $start->directory,
            $start->account_generation,
            $settings->recipeFor($program),
        );
    }
}
