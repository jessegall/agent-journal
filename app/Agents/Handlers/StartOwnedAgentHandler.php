<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\StartAgent;
use App\Agents\Commands\StartOwnedAgent;
use App\Agents\Contracts\CurrentSession;
use App\Agents\Contracts\RequestSource;
use App\Agents\Support\OwnerStartReceipt;
use App\Bus\Contracts\CommandBus;
use App\Contracts\CommandHandler;

/**
 * Turns an owner's request into Core's StartAgent with the calling session as its parent and runs it nested, so the
 * start joins the owner's transaction and a refusal rolls back the owner's writes with it.
 */
final readonly class StartOwnedAgentHandler implements CommandHandler
{
    public function __construct(
        private CurrentSession $sessions,
        private CommandBus $commands,
        private RequestSource $sources,
    ) {}

    public function handle(StartOwnedAgent $command): OwnerStartReceipt
    {
        $request = $command->request;
        $parentSessionId = $this->sessions->hasSession() ? $this->sessions->sessionId() : null;

        $receipt = $this->commands->run(
            new StartAgent($request->startRequest($parentSessionId, $this->sources->selectedSource())),
        );

        return OwnerStartReceipt::ofStart(
            $receipt,
            $request->executionMode(),
            $request->policy->configurationHash,
        );
    }
}
