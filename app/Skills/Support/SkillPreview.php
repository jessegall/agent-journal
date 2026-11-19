<?php

declare(strict_types=1);

namespace App\Skills\Support;

use App\Agents\Models\Agent;
use App\Skills\Conditions\Everyone;
use App\Skills\Data\SkillAgentSelection;
use App\Skills\Exceptions\SkillAgentHidden;
use App\Skills\Exceptions\SkillContextUnavailable;
use App\Skills\Exceptions\SkillSelectionConflict;
use App\Skills\Resolvers\Support\SkillContextResolver;
use App\Skills\Values\ExcludedSkill;
use App\Skills\Values\SkillEntry;

/**
 * Explains who a skill reaches, for the actor of this request: every agent it may see with its answer and safe reason,
 * or one agent's whole selection. It writes nothing.
 */
final readonly class SkillPreview
{
    private const int MOST_AGENTS = 200;

    public function __construct(
        private SkillContextResolver $contexts,
        private SkillSelection $selection,
    ) {}

    /**
     * @return array{key: string, audience: string, condition: array<string, mixed>, agents: list<array{agent: string, name: string, outcome: string, reason: string}>}
     */
    public function audience(SkillEntry $skill): array
    {
        $agents = $this->contexts->visible(array_values(
            Agent::query()->orderBy('name')->readLimit(self::MOST_AGENTS)->get()->all(),
        ));
        $rows = array_map(fn (Agent $agent) => $this->rowFor($skill, $agent), $agents);

        return [
            'key' => $skill->key->key,
            'audience' => $skill->condition instanceof Everyone ? 'everyone in the authorized installation scope' : 'agents whose condition matches',
            'condition' => $skill->condition->toArray(),
            'agents' => $rows,
        ];
    }

    /**
     * The selection of the agent with this id, for an MCP tool that names the agent by id.
     *
     * @param  list<SkillEntry>  $skills
     */
    public function forAgentId(SkillEntry $skill, array $skills, string $agentId): SkillAgentSelection
    {
        return $this->forAgent($skill, $skills, Agent::query()->whereKey($agentId)->firstOrFail());
    }

    /**
     * @param  list<SkillEntry>  $skills  the whole catalogue
     *
     * @throws SkillAgentHidden
     * @throws SkillContextUnavailable
     * @throws SkillSelectionConflict
     */
    public function forAgent(SkillEntry $skill, array $skills, Agent $agent): SkillAgentSelection
    {
        $selected = $this->selection->select($skills, $this->contexts->forAgent($agent));
        $excluded = array_column(
            array_map(
                fn (ExcludedSkill $excluded) => ['key' => $excluded->key->key, 'reason' => $excluded->reason],
                $selected->excluded,
            ),
            'reason',
            'key',
        );

        return SkillAgentSelection::from([
            'key' => $skill->key->key,
            'agent' => $agent->id,
            'selected' => in_array($skill->key->key, $selected->selectedKeys(), true),
            'reason' => $excluded[$skill->key->key] ?? 'selected',
            'selection' => $selected->selectedKeys(),
            'digest' => $selected->digest,
        ]);
    }

    /**
     * One visible agent's answer.
     *
     * @return array{agent: string, name: string, outcome: string, reason: string}
     */
    private function rowFor(SkillEntry $skill, Agent $agent): array
    {
        try {
            $result = $skill->condition->evaluate($this->contexts->forAgent($agent));
        } catch (SkillContextUnavailable $unavailable) {
            return [
                'agent' => $agent->id,
                'name' => $agent->name,
                'outcome' => 'unavailable',
                'reason' => $unavailable->getMessage(),
            ];
        }

        return [
            'agent' => $agent->id,
            'name' => $agent->name,
            'outcome' => $result->outcome->value,
            'reason' => $result->reason,
        ];
    }
}
