<?php

declare(strict_types=1);

namespace App\Skills\Console;

use App\Skills\Console\Concerns\PrintsSkillRefusals;
use App\Skills\Models\SkillRevision;
use App\Skills\Support\SkillAuthoring;
use App\Skills\Values\SkillSection;
use Illuminate\Console\Command;

/**
 * Shows one revision of a stored skill as it was saved: its name, description, condition and sections.
 */
final class SkillRevisionCommand extends Command
{
    use PrintsSkillRefusals;

    protected $signature = 'skill:revision {number : The skill number or key} {revision : The revision number}';

    protected $description = 'Show one revision of a stored skill';

    public function handle(SkillAuthoring $console): int
    {
        return $this->printRefusals(function () use ($console) {
            $console->actAsOwner();

            $revision = SkillRevision::numbered(
                $console->stored((string) $this->argument('number')),
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
                    $revision->sections,
                ),
            ];
        });
    }
}
