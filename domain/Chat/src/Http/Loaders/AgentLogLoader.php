<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Loaders;

use App\Sessions\Contracts\AgentDirectory;
use Domain\Chat\Data\AgentLogData;
use Domain\Chat\Data\AgentLogInput;
use Domain\Chat\Support\AgentStartLog;

/**
 * An agent's technical log, read only when the chat's Technical details panel opens; an agent the reader cannot see
 * is refused.
 */
final readonly class AgentLogLoader
{
    public function __construct(private AgentDirectory $agents, private AgentStartLog $log) {}

    public function __invoke(AgentLogInput $input): AgentLogData
    {
        $agent = $this->agents->visibleAgent($input->agent);

        return $this->log->of($agent->agentId);
    }
}
