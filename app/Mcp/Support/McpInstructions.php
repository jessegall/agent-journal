<?php

declare(strict_types=1);

namespace App\Mcp\Support;

use App\Actors\Contracts\CurrentAuthorizer;
use App\Actors\Values\AccessRequirement;
use App\Assignments\Policies\AssignmentRecipientPolicy;
use App\Operations\Enums\AccessType;

/**
 * What a started agent is told about the journal's MCP tools at every context start, by what its profile grants: how
 * to use them, and which of its journeys still go through the CLI or the web. It names no token and no path.
 */
final readonly class McpInstructions
{
    private const string TOOLS = "Use the journal MCP tools for journal work: call overview_read first and follow its next_action; send each write with a request_key and keep it; when a write's outcome is unknown, call operations_read with that key before trying again.";

    private const string USER_ONLY = 'Every decision only the user makes stays theirs: ask with journal question ask.';

    public function __construct(private CurrentAuthorizer $authorizer) {}

    /**
     * The guidance for the calling agent: the journeys outside MCP its own profile lets it take.
     */
    public function forCaller(): string
    {
        $journeys = array_keys(array_filter(
            $this->journeys(),
            fn (array $requirements) => $this->grantsAll($requirements),
        ));

        return self::TOOLS.' These stay on the CLI or the web: '.implode('; ', $journeys).'. '.self::USER_ONLY;
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
            'skill inspection (journal skill)' => [],
            'inbox history and acknowledgements (journal message)' => [],
            'reminders (journal reminder)' => $dispatch,
            'helper dispatch (journal helper)' => $dispatch,
            'plan cancellation (journal plan cancel)' => $dispatch,
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
