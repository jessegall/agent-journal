<?php

declare(strict_types=1);

namespace App\Mcp\Support;

use App\Contracts\Authorization\CurrentAuthorizer;
use App\Enums\AccessType;
use App\Policies\AssignmentRecipientPolicy;
use App\Values\AccessRequirement;
use App\Values\AgentText;

/**
 * What a started agent is told about the journal's MCP tools at every context start, by what its profile grants: how
 * to use them, and which of its journeys still go through the CLI or the web. It names no token and no path.
 */
final readonly class McpInstructions
{
    public function __construct(private CurrentAuthorizer $authorizer) {}

    /**
     * The guidance for the calling agent: the journeys outside MCP its own profile lets it take.
     */
    public function forCaller(): AgentText
    {
        $journeys = array_keys(array_filter(
            $this->journeys(),
            fn (array $requirements) => $this->grantsAll($requirements),
        ));

        return AgentText::of('core.mcp.instructions', ['journeys' => implode('; ', $journeys)]);
    }

    /**
     * Each journey that stays outside MCP, with the abilities it needs; none for a journey every agent has.
     *
     * @return array<string, list<AccessRequirement>>
     */
    private function journeys(): array
    {
        $dispatch = [new AccessRequirement(AssignmentRecipientPolicy::class, AccessType::Delegate)];

        return [
            'sequences (journal sequence)' => [],
            'process outputs and their readers (journal output, journal reader)' => [],
            'account work (the Accounts page)' => $dispatch,
        ];
    }

    /**
     * @param  list<AccessRequirement>  $requirements
     */
    private function grantsAll(array $requirements): bool
    {
        foreach ($requirements as $requirement) {
            if (! $requirement->isGrantedToCaller($this->authorizer)) {
                return false;
            }
        }

        return true;
    }
}
