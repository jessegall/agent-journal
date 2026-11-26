<?php

declare(strict_types=1);

namespace Tests\Commands\Skills;

use App\Agents\Values\PlanFile;
use App\Skills\StartSkillFiles;
use Tests\Support\CommitsHookRows;
use Tests\TestCase;

/**
 * A session's start writes the skills it was handed into its driver's skill folder, and nothing when it was handed none.
 */
final class StartSkillFilesTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'skill_generations',
        'skill_requests',
        'skill_revisions',
        'skills',
        'number_groups',
        'command_receipts',
        'process_runs',
        'part_runs',
        'agent_stacks',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner()->agent('Writer')->agent('Reader');
    }

    public function test_a_handed_session_writes_each_skill_in_its_drivers_folder(): void
    {
        $this->journal->refreshSkills()->actAs('Owner');
        $session = $this->journal->handSkillsTo('Writer');

        $names = array_map(
            fn (PlanFile $file) => $file->name,
            $this->app->make(StartSkillFiles::class)->of($session->id),
        );

        $this->journal->assertResult(
            [true, true],
            [
                $names !== [],
                array_all($names, fn (string $name) => str_starts_with($name, 'journal-skills/')),
            ],
        );
    }

    public function test_a_session_handed_no_skills_writes_none(): void
    {
        $session = $this->journal->sessionOf('Reader');

        $this->journal->assertResult([], $this->app->make(StartSkillFiles::class)->of($session->id));
    }
}
