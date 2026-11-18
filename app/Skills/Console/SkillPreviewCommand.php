<?php

declare(strict_types=1);

namespace App\Skills\Console;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Contracts\JournalAccessPolicy;
use App\Actors\Support\ActorContext;
use App\Agents\Models\Agent;
use App\Skills\Conditions\Everyone;
use App\Skills\Contracts\SkillReader;
use App\Skills\Exceptions\SkillConditionInvalid;
use App\Skills\Exceptions\SkillConflict;
use App\Skills\Exceptions\SkillContextUnavailable;
use App\Skills\Exceptions\SkillDeclarationInvalid;
use App\Skills\Exceptions\SkillKeyInvalid;
use App\Skills\Exceptions\SkillMissing;
use App\Skills\Exceptions\SkillPreviewRefused;
use App\Skills\Exceptions\SkillSelectionConflict;
use App\Skills\Exceptions\SkillSourceInvalid;
use App\Skills\Readers\SkillContextReader;
use App\Skills\Support\SkillSelection;
use App\Skills\Values\SkillEntry;
use App\Skills\Values\SkillKey;
use Illuminate\Console\Command;
use Illuminate\Contracts\Container\Container;

/**
 * Explains who a skill reaches, as the journal's owner: every agent with its match, no match or unavailable answer and
 * the safe reason, or one agent's whole selection. It writes nothing.
 */
final class SkillPreviewCommand extends Command
{
    private const int MOST_AGENTS = 200;

    protected $signature = 'skill:preview {key : The key of the skill} {--agent= : One agent whose selection to show} {--json : Print the preview as JSON}';

    protected $description = 'Show which agents a skill reaches and why';

    public function handle(Container $container, JournalAccessPolicy $access, CurrentActorSetter $actors, SkillContextReader $contexts, SkillSelection $selection): int
    {
        $owner = $access->allowedUserIds()[0] ?? throw SkillPreviewRefused::noOwner();
        $actors->set(ActorContext::forUser($owner));

        try {
            $reader = $container->make(SkillReader::class);
            $skill = $reader->find(SkillKey::from((string) $this->argument('key')));
        } catch (SkillKeyInvalid|SkillMissing|SkillSourceInvalid|SkillConflict|SkillDeclarationInvalid|SkillConditionInvalid $failure) {
            $this->error($failure->getMessage());

            return self::FAILURE;
        }

        if ($this->option('agent') !== null) {
            return $this->showSelection($skill, $reader->all(), Agent::query()->whereKey((string) $this->option('agent'))->firstOrFail(), $contexts, $selection);
        }

        $rows = array_map(fn (Agent $agent) => $this->rowFor($skill, $agent, $contexts), Agent::query()->orderBy('name')->readLimit(self::MOST_AGENTS)->get()->all());
        $audience = $skill->condition instanceof Everyone ? 'everyone in the authorized installation scope' : 'agents whose condition matches';

        if ($this->option('json')) {
            $this->line(json_encode(['key' => $skill->key->key, 'audience' => $audience, 'condition' => $skill->condition->toArray(), 'agents' => $rows], JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES));

            return self::SUCCESS;
        }

        $this->line("Skill {$skill->key->key} reaches {$audience}.");
        $this->table(['Agent', 'Name', 'Outcome', 'Reason'], array_map(array_values(...), $rows));

        return self::SUCCESS;
    }

    /**
     * @return array{agent: string, name: string, outcome: string, reason: string}
     */
    private function rowFor(SkillEntry $skill, Agent $agent, SkillContextReader $contexts): array
    {
        try {
            $result = $skill->condition->evaluate($contexts->forAgent($agent));
        } catch (SkillContextUnavailable $unavailable) {
            return ['agent' => $agent->id, 'name' => $agent->name, 'outcome' => 'unavailable', 'reason' => $unavailable->getMessage()];
        }

        return ['agent' => $agent->id, 'name' => $agent->name, 'outcome' => $result->outcome->value, 'reason' => $result->reason];
    }

    /**
     * @param  list<SkillEntry>  $skills
     */
    private function showSelection(SkillEntry $skill, array $skills, Agent $agent, SkillContextReader $contexts, SkillSelection $selection): int
    {
        try {
            $selected = $selection->select($skills, $contexts->forAgent($agent));
        } catch (SkillContextUnavailable|SkillSelectionConflict $refusal) {
            $this->error($refusal->getMessage());

            return self::FAILURE;
        }

        $excluded = array_column(array_map(fn ($skill) => ['key' => $skill->key->key, 'reason' => $skill->reason], $selected->excluded), 'reason', 'key');
        $answer = ['key' => $skill->key->key, 'agent' => $agent->id, 'selected' => in_array($skill->key->key, $selected->selectedKeys(), true), 'reason' => $excluded[$skill->key->key] ?? 'selected', 'selection' => $selected->selectedKeys(), 'digest' => $selected->digest];

        if ($this->option('json')) {
            $this->line(json_encode($answer, JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES));

            return self::SUCCESS;
        }

        $this->line("Skill {$skill->key->key} for agent {$agent->name}: ".($answer['selected'] ? 'selected' : "not selected ({$answer['reason']})"));
        $this->line('Selected for this agent: '.($answer['selection'] === [] ? 'none' : implode(', ', $answer['selection'])));

        return self::SUCCESS;
    }
}
