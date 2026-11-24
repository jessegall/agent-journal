<?php

declare(strict_types=1);

namespace App\Commands\StartOwnedAgent;

use App\Commands\StartAgent\StartAgentCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Bus\CommandHandler;
use App\Contracts\Bus\RequestSource;
use App\Contracts\Sessions\BuiltInStartProfiles;
use App\Contracts\Sessions\CurrentSession;
use App\Models\Agents\Agent;
use App\Support\OwnerStartReceipt;
use App\Support\StartPreviews;

/**
 * Turns an owner's request into Core's StartAgentCommand with the calling session as its parent and runs it nested, so the
 * start joins the owner's transaction and a refusal rolls back the owner's writes with it.
 */
final readonly class StartOwnedAgentHandler implements CommandHandler
{
    public function __construct(
        private CurrentSession $sessions,
        private CommandBus $commands,
        private RequestSource $sources,
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

        $receipt = $this->commands->run(
            new StartAgentCommand(
                $request->startRequest($parentSessionId, $driverType, $this->sources->selectedSource()),
            ),
        );

        return OwnerStartReceipt::ofStart(
            $receipt,
            $request->executionMode(),
            $request->policy->configurationHash,
        );
    }
}
