<?php

declare(strict_types=1);

namespace App\Mcp\Support;

use App\Agents\Support\AgentContext;
use App\Agents\Support\StackTarget;
use App\Hooks\Contracts\CurrentState;
use App\Hooks\Decisions\StateReference;
use App\Mcp\Data\ToolResult;
use Illuminate\Contracts\Container\Container;

/**
 * The calling agent's overview: who it is in this session, the state its stack answers from, and each owner's
 * section of counts. It reads; it changes nothing and shows no other agent's numbers.
 */
final readonly class OverviewResolver
{
    public function __construct(
        private AgentContext $agent,
        private CurrentState $states,
        private McpCatalogue $catalogue,
        private Container $container,
    ) {}

    public function read(): ToolResult
    {
        $sections = [];

        foreach ($this->catalogue->overviewContributionClasses() as $className) {
            $contribution = $this->container->make($className);
            $sections[$contribution->section()] = $contribution->read()->structuredContent();
        }

        return ToolResult::ok([
            'agent_id' => $this->agent->agentId,
            'session_id' => $this->agent->sessionId,
            'stack_state' => $this->states->top(new StackTarget($this->agent->agentId, $this->agent->sessionId))
                ->map(fn (StateReference $state): string => $state->typeKey)
                ->getOrElse(null),
            'sections' => (object) $sections,
        ], []);
    }
}
