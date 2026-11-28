<?php

declare(strict_types=1);

namespace App\Agents;

use App\Agents\Commands\StartProfileMain\StartProfileMainCommand;
use App\Bus\Contracts\CommandBus;
use App\Bus\Contracts\RequestKey;
use App\Exceptions\SessionOutdated;
use App\Exceptions\StackTargetRefused;
use App\Models\Agents\AgentStartChoice;
use App\Sessions\Contracts\AgentDirectory;

/**
 * What a message to an agent does first: the agent must still run the session the sender saw, and an agent with no
 * session is started or resumed, on the choice kept for its next start, under the message's request key, so it reads
 * the message once it runs.
 */
final readonly class AgentStartOnMessage
{
    public function __construct(
        private AgentDirectory $agents,
        private CommandBus $commands,
        private RequestKey $requestKey,
    ) {}

    /**
     * Answers whether it started the agent, under the request's key.
     *
     * @throws SessionOutdated
     * @throws StackTargetRefused
     */
    public function prepare(string $agentId, string|null $expectedSessionId): bool
    {
        $agent = $this->agents->visibleAgent($agentId);
        $agent->assertRuns($expectedSessionId);

        if (! $agent->isStartable()) {
            return false;
        }

        $this->commands->run(StartProfileMainCommand::onMessage(
            $this->requestKey->requireFor(StartProfileMainCommand::class),
            $agent,
            AgentStartChoice::findFor($agent->agentId),
        ));

        return true;
    }
}
