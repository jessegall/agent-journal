<?php

declare(strict_types=1);

namespace App\Agents\Commands\StartOwnedAgent;

use App\Agents\Commands\StartAgent\StartAgentCommand;
use App\Bus\Contracts\CommandBus;
use App\Bus\Contracts\CommandHandler;
use App\Models\Agents\Agent;
use App\Sessions\Contracts\BuiltInStartProfiles;
use App\Sessions\Contracts\CurrentSession;
use App\Sessions\OwnerStartReceipt;
use App\Sessions\StartPreviews;

/**
 * Turns an owner's request into Core's StartAgentCommand with the calling session as its parent and runs it nested, so the
 * start joins the owner's transaction and a refusal rolls back the owner's writes with it.
 */
final readonly class StartOwnedAgentHandler implements CommandHandler
{
    public function __construct(
        private CurrentSession $sessions,
        private CommandBus $commands,
        private BuiltInStartProfiles $profiles,
        private StartPreviews $previews,
    ) {}

    public function handle(StartOwnedAgentCommand $command): OwnerStartReceipt
    {
        $request = $command->request;
        $parentSessionId = $this->sessions->hasSession() ? $this->sessions->sessionId() : null;
        $agent = Agent::query()->findOrFail($request->agent->id);

        [$driverType] = $this->previews->chosenDriverType(
            $agent,
            $request->selection->driver,
            $request->driverType,
            $this->profiles->defaultDriverTypeOf($agent->profile_key),
        );

        $start = $request->startRequest($parentSessionId, $driverType);
        $receipt = $this->commands->run(new StartAgentCommand($start));

        return OwnerStartReceipt::ofStart(
            $receipt,
            $request->executionMode(),
            $request->policy->configurationHash,
        );
    }
}
