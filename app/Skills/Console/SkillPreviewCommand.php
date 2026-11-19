<?php

declare(strict_types=1);

namespace App\Skills\Console;

use App\Agents\Models\Agent;
use App\Skills\Contracts\SkillResolver;
use App\Skills\Data\SkillAgentSelection;
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

/**
 * Explains who a skill reaches, as the journal's owner: every agent with its match, no match or unavailable answer and
 * the safe reason, or one agent's whole selection. It writes nothing.
 */
final class SkillPreviewCommand extends Command
{
    protected $signature = 'skill:preview {key : The key of the skill} {--agent= : One agent whose selection to show} {--json : Print the preview as JSON}';

    protected $description = 'Show which agents a skill reaches and why';

    public function handle(SkillResolver $skills, SkillAuthoring $authoring, SkillPreview $preview): int
    {
        $authoring->actAsOwner();

        try {
            $resolver = $skills;
            $skill = $resolver->find(SkillKey::from((string) $this->argument('key')));

            if ($this->option('agent') !== null) {
                $answer = $preview->forAgent($skill, $resolver->all(), Agent::query()->whereKey((string) $this->option('agent'))->firstOrFail());

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

    private function printAnswer(SkillAgentSelection $answer): int
    {
        if ($this->option('json')) {
            $this->line(json_encode($answer->toArray(), JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES));

            return self::SUCCESS;
        }

        $this->line($answer->summary());

        return self::SUCCESS;
    }
}
