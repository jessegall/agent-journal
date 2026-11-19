<?php

declare(strict_types=1);

namespace App\Skills\Console;

use App\Skills\Console\Concerns\PrintsSkillRefusals;
use App\Skills\Models\SkillRevision;
use App\Skills\Support\SkillAuthoring;
use Illuminate\Console\Command;

/**
 * Lists a stored skill's revisions, newest first, with its status.
 */
final class SkillRevisionsCommand extends Command
{
    use PrintsSkillRefusals;

    private const int ROWS = 100;

    protected $signature = 'skill:revisions {number : The skill number or key}';

    protected $description = 'List the revisions of a stored skill';

    public function handle(SkillAuthoring $console): int
    {
        return $this->printRefusals(function () use ($console) {
            $console->actAsOwner();
            $skill = $console->stored((string) $this->argument('number'));
            $this->table(
                ['Revision', 'Name', 'Author', 'Copied from', 'Saved'],
                array_map(
                    fn (SkillRevision $revision) => [
                        $revision->revision,
                        $revision->name,
                        "{$revision->author_type->value}:{$revision->author_id}",
                        $revision->source_key ?? '',
                        $revision->created_at->toIso8601String(),
                    ],
                    SkillRevision::historyOf($skill, self::ROWS),
                ),
            );

            return $console->statusLines($skill);
        });
    }
}
