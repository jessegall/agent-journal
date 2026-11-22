<?php

declare(strict_types=1);

namespace App\Commands\StartOwnedAgent;

use App\Commands\StartAgent\StartAgentCommand;
use App\Contracts\CommandBus;
use App\Contracts\CommandHandler;
use App\Contracts\CurrentSession;
use App\Contracts\RequestSource;
use App\Support\OwnerStartReceipt;

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
    ) {}

    public function handle(StartOwnedAgentCommand $command): OwnerStartReceipt
    {
        $request = $command->request;
        $parentSessionId = $this->sessions->hasSession() ? $this->sessions->sessionId() : null;

        $receipt = $this->commands->run(
            new StartAgentCommand($request->startRequest($parentSessionId, $this->sources->selectedSource())),
        );

        return OwnerStartReceipt::ofStart(
            $receipt,
            $request->executionMode(),
            $request->policy->configurationHash,
        );
    }
}
