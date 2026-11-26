<?php

declare(strict_types=1);

namespace Tests\Commands\Skills;

use App\Bus\Contracts\Command;
use App\Bus\Contracts\CommandBus;
use App\Models\Skills\Skill;
use App\Models\Skills\SkillRevision;
use App\Skills\Commands\CreateSkill\CreateSkillCommand;
use App\Skills\Commands\RestoreSkill\RestoreSkillCommand;
use App\Skills\Commands\ReviseSkill\ReviseSkillCommand;
use App\Skills\Values\SectionDraft;
use App\Skills\Values\SkillDraft;
use App\Skills\Values\SkillRevisionResult;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * Restoring an old revision appends its content as a new revision.
 */
#[TestsCommand(RestoreSkillCommand::class)]
final class RestoreSkillTest extends TestCase
{
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

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->actAsUserId(TestIds::of(7));
    }

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
