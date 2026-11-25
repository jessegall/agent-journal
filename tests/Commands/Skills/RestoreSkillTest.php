<?php

declare(strict_types=1);

namespace Tests\Commands\Skills;

use App\Commands\Skills\CreateSkill\CreateSkillCommand;
use App\Commands\Skills\RestoreSkill\RestoreSkillCommand;
use App\Commands\Skills\ReviseSkill\ReviseSkillCommand;
use App\Contracts\Bus\Command;
use App\Contracts\Bus\CommandBus;
use App\Models\Skills\Skill;
use App\Models\Skills\SkillRevision;
use App\Values\SectionDraft;
use App\Values\SkillDraft;
use App\Values\SkillRevisionResult;
use Tests\Support\ActsAsTestUser;
use Tests\Support\CommitsHookRows;
use Tests\TestCase;

/**
 * Restoring an old revision appends its content as a new revision.
 */
final class RestoreSkillTest extends TestCase
{
    use ActsAsTestUser;
    use CommitsHookRows;

    private const array TABLES = [
        'skill_publications',
        'skill_generations',
        'skill_requests',
        'skill_revisions',
        'skills',
        'number_groups',
        'command_receipts',
    ];

    public function test_restore_appends_the_old_content_as_a_new_revision(): void
    {
        $created = $this->runCommand(new CreateSkillCommand('user-review-notes', 'create-1', $this->draft('First.')));
        $this->runCommand(new ReviseSkillCommand($created->skillId, 1, 'revise-1', $this->draft('Second.')));
        $restored = $this->runCommand(new RestoreSkillCommand($created->skillId, 1, 2, 'restore-1'));
        $skill = Skill::query()->whereKey($created->skillId)->firstOrFail();

        $this->assertSame(3, $restored->revision);
        $this->assertSame('First.', SkillRevision::findCurrentOf($skill)->sections[0]->content);
        $this->assertSame('Second.', SkillRevision::findNumbered($skill, 2)->sections[0]->content);
    }

    private function draft(string $text): SkillDraft
    {
        return new SkillDraft(
            'Review notes',
            'Read before reviewing.',
            [new SectionDraft('notes', 'Notes', $text)],
            '',
        );
    }

    /**
     * @param  Command<SkillRevisionResult>  $command
     */
    private function runCommand(Command $command): SkillRevisionResult
    {
        return $this->app->make(CommandBus::class)->run($command);
    }
}
