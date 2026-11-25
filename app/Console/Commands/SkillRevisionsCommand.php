<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Console\Concerns\NamesStoredSkill;
use App\Console\Concerns\PrintsSkillRefusals;
use App\Models\Skills\SkillRevision;
use App\Support\SkillAuthoringService;
use Illuminate\Console\Command;

/**
 * Lists a stored skill's revisions, newest first, with its status.
 */
final class SkillRevisionsCommand extends Command
{
    use NamesStoredSkill;
    use PrintsSkillRefusals;

    private const int ROWS = 100;

    protected $signature = 'skill:revisions {number : The skill number or key}';

    protected $description = 'List the revisions of a stored skill';

    public function handle(SkillAuthoringService $console): int
    {
        return $this->printRefusals(function () use ($console) {
            $console->actAsOwner();
            $skill = $console->storedSkill($this->skillNumber());

            $this->table(
                [
                    'Revision',
                    'Name',
                    'Author',
                    'Copied from',
                    'Saved',
                ],
                array_map(
                    fn (SkillRevision $revision) => [
                        $revision->revision,
                        $revision->name,
                        "{$revision->author_type}:{$revision->author_id}",
                        $revision->source_key ?? '',
                        $revision->created_at->toIso8601String(),
                    ],
                    SkillRevision::findHistoryOf($skill, self::ROWS),
                ),
            );

            return $console->statusLines($skill);
        });
    }
}
