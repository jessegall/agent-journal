<?php

declare(strict_types=1);

namespace Tests\Architecture\Seeding;

use App\Values\PartKey;
use App\Values\SectionDraft;
use App\Values\SkillDraft;
use Tests\Support\CommitsHookRows;
use Tests\Support\Skills\HasSkillTargets;
use Tests\TestCase;

/**
 * The journal makes a skill and delivers it to the session's target in a folder of the test's own, and admits a
 * process run for an agent with a started part.
 */
final class JournalSkillsTest extends TestCase
{
    use CommitsHookRows;
    use HasSkillTargets;

    /**
     * The skill and run commands commit for real, so these tables are emptied around each test.
     */
    private const array TABLES = [
        'skill_publications', 'skill_generations', 'skill_requests', 'skill_revisions', 'skills', 'number_groups',
        'command_receipts', 'process_runs', 'part_runs',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner()->agent('Writer');
    }

    public function test_a_skill_is_made_and_delivered_to_the_sessions_target(): void
    {
        $this->journal->skill('user-review-notes', new SkillDraft(
            'Review notes',
            'Read before reviewing.',
            [new SectionDraft('notes', 'Notes', 'Read the diff first.')],
            '',
        ));

        $this->journal->publishSkills()->assertSkillPublished('user-review-notes', $this->journal->sessionOf('Writer'));

        $this->assertSame(1, $this->journal->skillRevisionOf('user-review-notes')->revision);
    }

    public function test_a_created_process_run_is_given_back_and_still_found_by_its_name(): void
    {
        $run = $this->journal->actAs('Writer')->createProcessRun('Read', 'cat composer.json');

        $this->assertTrue($run->is($this->journal->processRunCalled('Read')));
    }

    public function test_a_process_run_is_admitted_for_the_agent_with_its_part_started(): void
    {
        $this->journal->actAs('Writer')->processRun('Read', 'cat composer.json')->runningPart(
            'Read',
            new PartKey(1, 1, 'cat'),
        );

        $part = $this->journal->partOf('Read', 1);
        $this->assertSame(
            ['test host', $this->journal->processRunCalled('Read')->id],
            [$part->host, $part->process_run_id],
        );
    }
}
