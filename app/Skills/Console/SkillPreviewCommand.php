<?php

declare(strict_types=1);

namespace App\Skills\Console;

use App\Agents\Models\Agent;
use App\Skills\Contracts\SkillReader;
use App\Skills\Exceptions\SkillAgentHidden;
use App\Skills\Exceptions\SkillConditionInvalid;
use App\Skills\Exceptions\SkillConflict;
use App\Skills\Exceptions\SkillContextUnavailable;
use App\Skills\Exceptions\SkillDeclarationInvalid;
use App\Skills\Exceptions\SkillKeyInvalid;
use App\Skills\Exceptions\SkillMissing;
use App\Skills\Exceptions\SkillSelectionConflict;
use App\Skills\Exceptions\SkillSourceInvalid;
use App\Skills\Support\SkillAuthoring;
use App\Skills\Support\SkillPreview;
use App\Skills\Values\SkillKey;
use Illuminate\Console\Command;
use Illuminate\Contracts\Container\Container;

/**
 * Explains who a skill reaches, as the journal's owner: every agent with its match, no match or unavailable answer and
 * the safe reason, or one agent's whole selection. It writes nothing.
 */
final class SkillPreviewCommand extends Command
{
    protected $signature = 'skill:preview {key : The key of the skill} {--agent= : One agent whose selection to show} {--json : Print the preview as JSON}';

    protected $description = 'Show which agents a skill reaches and why';

    public function handle(Container $container, SkillAuthoring $authoring, SkillPreview $preview): int
    {
        $authoring->actAsOwner();

        try {
            $reader = $container->make(SkillReader::class);
            $skill = $reader->find(SkillKey::from((string) $this->argument('key')));

            if ($this->option('agent') !== null) {
                $answer = $preview->forAgent($skill, $reader->all(), Agent::query()->whereKey((string) $this->option('agent'))->firstOrFail());

                return $this->printAnswer($answer);
            }

            $audience = $preview->audience($skill);
        } catch (SkillKeyInvalid|SkillMissing|SkillSourceInvalid|SkillConflict|SkillDeclarationInvalid|SkillConditionInvalid|SkillAgentHidden|SkillContextUnavailable|SkillSelectionConflict $failure) {
            $this->error($failure->getMessage());

            return self::FAILURE;
        }

        if ($this->option('json')) {
            $this->line(json_encode($audience, JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES));

            return self::SUCCESS;
        }

        $this->line("Skill {$audience['key']} reaches {$audience['audience']}.");
        $this->table(['Agent', 'Name', 'Outcome', 'Reason'], array_map(array_values(...), $audience['agents']));

        return self::SUCCESS;
    }

    /**
     * @param  array{key: string, agent: string, selected: bool, reason: string, selection: list<string>, digest: string}  $answer
     */
    private function printAnswer(array $answer): int
    {
        if ($this->option('json')) {
            $this->line(json_encode($answer, JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES));

            return self::SUCCESS;
        }

        $this->line("Skill {$answer['key']} for agent {$answer['agent']}: ".($answer['selected'] ? 'selected' : "not selected ({$answer['reason']})"));
        $this->line('Selected for this agent: '.($answer['selection'] === [] ? 'none' : implode(', ', $answer['selection'])));

        return self::SUCCESS;
    }
}
