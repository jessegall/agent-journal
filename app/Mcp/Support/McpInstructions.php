<?php

declare(strict_types=1);

namespace App\Mcp\Support;

use App\Agents\Enums\AgentRole;

/**
 * What a launched agent is told about the journal's MCP tools at every context start, for its role: how to use them,
 * and which of its journeys still go through the CLI or the web. It names no token and no path.
 */
final readonly class McpInstructions
{
    private const string TOOLS = 'Use the journal MCP tools for journal work: call overview_read first and follow its next_action; send each write with a request_key and keep it; when a write\'s outcome is unknown, call operations_read with that key before trying again.';

    /**
     * Each journey that stays outside MCP, with the roles that have it.
     */
    private const array JOURNEYS = [
        'sequences (journal sequence)' => [AgentRole::MainAgent, AgentRole::ReadOnlyHelper, AgentRole::WritingHelper],
        'process outputs and their readers (journal output, journal reader)' => [AgentRole::MainAgent, AgentRole::ReadOnlyHelper, AgentRole::WritingHelper],
        'reminders (journal reminder)' => [AgentRole::MainAgent],
        'helper dispatch (journal helper)' => [AgentRole::MainAgent],
        'account work (the Accounts page)' => [AgentRole::MainAgent],
    ];

    private const string USER_ONLY = 'Every decision only the user makes stays theirs: ask with journal question ask.';

    public function for(AgentRole $role): string
    {
        $journeys = array_keys(array_filter(self::JOURNEYS, fn (array $roles): bool => in_array($role, $roles, true)));

        return self::TOOLS.' These stay on the CLI or the web: '.implode('; ', $journeys).'. '.self::USER_ONLY;
    }
}
