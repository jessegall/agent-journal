<?php

declare(strict_types=1);

namespace App\Skills\Support;

use App\Agents\Models\Agent;
use App\Skills\Conditions\Everyone;
use App\Skills\Exceptions\SkillAgentHidden;
use App\Skills\Exceptions\SkillContextUnavailable;
use App\Skills\Exceptions\SkillSelectionConflict;
use App\Skills\Readers\SkillContextReader;
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
        private SkillContextReader $contexts,
        private SkillSelection $selection,
    ) {}

    /**
     * @return array{key: string, audience: string, condition: array<string, mixed>, agents: list<array{agent: string, name: string, outcome: string, reason: string}>}
     */
    public function audience(SkillEntry $skill): array
    {
        $agents = Agent::query()->orderBy('name')->readLimit(self::MOST_AGENTS)->get()->all();
        $rows = array_values(array_filter(array_map(fn (Agent $agent) => $this->rowFor($skill, $agent), $agents)));

        return [
            'key' => $skill->key->key,
            'audience' => $skill->condition instanceof Everyone ? 'everyone in the authorized installation scope' : 'agents whose condition matches',
            'condition' => $skill->condition->toArray(),
            'agents' => $rows,
        ];
    }

    /**
     * @param  list<SkillEntry>  $skills  the whole catalogue
     * @return array{key: string, agent: string, selected: bool, reason: string, selection: list<string>, digest: string}
     *
     * @throws SkillAgentHidden
     * @throws SkillContextUnavailable
     * @throws SkillSelectionConflict
     */
    public function forAgent(SkillEntry $skill, array $skills, Agent $agent): array
    {
        $selected = $this->selection->select($skills, $this->contexts->forAgent($agent));
        $excluded = array_column(array_map(fn (ExcludedSkill $excluded) => ['key' => $excluded->key->key, 'reason' => $excluded->reason], $selected->excluded), 'reason', 'key');

        return [
            'key' => $skill->key->key,
            'agent' => $agent->id,
            'selected' => in_array($skill->key->key, $selected->selectedKeys(), true),
            'reason' => $excluded[$skill->key->key] ?? 'selected',
            'selection' => $selected->selectedKeys(),
            'digest' => $selected->digest,
        ];
    }

    /**
     * One agent's answer, or null for an agent the actor may not see.
     *
     * @return array{agent: string, name: string, outcome: string, reason: string}|null
     */
    private function rowFor(SkillEntry $skill, Agent $agent): ?array
    {
        try {
            $result = $skill->condition->evaluate($this->contexts->forAgent($agent));
        } catch (SkillAgentHidden) {
            return null;
        } catch (SkillContextUnavailable $unavailable) {
            return ['agent' => $agent->id, 'name' => $agent->name, 'outcome' => 'unavailable', 'reason' => $unavailable->getMessage()];
        }

        return ['agent' => $agent->id, 'name' => $agent->name, 'outcome' => $result->outcome->value, 'reason' => $result->reason];
    }
}
