<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Console\Concerns\NamesStoredSkill;
use App\Console\Concerns\PrintsSkillRefusals;
use App\Models\Skills\SkillRevision;
use App\Support\SkillAuthoringService;
use App\Values\SkillSection;
use Illuminate\Console\Command;

/**
 * Shows one revision of a stored skill as it was saved: its name, description, condition and sections.
 */
final class SkillRevisionCommand extends Command
{
    use NamesStoredSkill;
    use PrintsSkillRefusals;

    protected $signature = 'skill:revision {number : The skill number or key} {revision : The revision number}';

    protected $description = 'Show one revision of a stored skill';

    public function handle(SkillAuthoringService $console): int
    {
        return $this->printRefusals(function () use ($console) {
            $console->actAsOwner();

            $revision = SkillRevision::numbered(
                $console->storedSkill($this->skillNumber()),
                (int) $this->argument('revision'),
            );

            return [
                "Revision {$revision->revision}: {$revision->name}",
                "Description: {$revision->description}",
                'Condition: '.json_encode($revision->condition, JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES),
                ...array_map(
                    fn (SkillSection $section) => <<<TEXT
                    ## {$section->heading}

                    {$section->storedText()}
                    TEXT,
                    $revision->sections->items(),
                ),
            ];
        });
    }
}
