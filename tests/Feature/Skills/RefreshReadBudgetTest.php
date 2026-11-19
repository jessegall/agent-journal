<?php

declare(strict_types=1);

namespace Tests\Feature\Skills;

use App\Agents\Enums\SessionStatus;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Skills\Conditions\Conditions;
use App\Skills\Handlers\RefreshSkillsHandler;
use App\Skills\Models\Skill;
use App\Skills\Models\SkillPublication;
use App\Skills\Support\SkillPublishing;
use App\Skills\Support\SkillTargets;
use App\Skills\Values\SectionDraft;
use App\Skills\Values\SkillDraft;
use App\Skills\Values\SkillKey;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\AssertsReadBudget;
use Tests\Support\CommitsHookRows;
use Tests\Support\InstallsBuiltInProfiles;
use Tests\Support\TestActors;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\UsesTemporaryFolder;
use Tests\TestCase;

/**
 * A refresh that changes nothing reads each session's facts once and the stored skills in batches: the same queries
 * per session with 10 skills as with 1,000, within the refresh's ReadBudget, and every session is still reached.
 */
#[TimeLimit(seconds: 60, reason: 'It seeds 1,000 stored skills and 100 sessions before measuring.')]
final class RefreshReadBudgetTest extends TestCase
{
    use AssertsReadBudget, CommitsHookRows;
    use InstallsBuiltInProfiles;
    use UsesTemporaryFolder;

    private const array TABLES = [
        'skill_publications',
        'skill_generations',
        'skill_requests',
        'skill_revisions',
        'skills',
        'number_groups',
        'command_receipts',
        'agents',
        'agent_sessions',
    ];

    private const int SESSIONS = 100;

    protected function setUp(): void
    {
        parent::setUp();

        $this->makeTemporaryFolder('journal-skills');
        $this->app->instance(SkillTargets::class, new SkillTargets((string) realpath($this->root)));
    }

    public function test_a_no_change_refresh_of_1000_skills_stays_within_its_budget_and_reaches_every_session(): void
    {
        $this->seedSkillsAndSessions(1_000);
        $publishing = $this->app->make(SkillPublishing::class);
        $publishing->refresh();

        $this->assertWithinReadBudget(fn () => $publishing->refresh(), [RefreshSkillsHandler::class, 'handle']);
        $this->assertSame(self::SESSIONS, SkillPublication::query()->distinct()->count('session_id'));
    }

    public function test_10_and_1000_skills_run_the_same_queries_per_session(): void
    {
        $this->seedSkillsAndSessions(10);
        $publishing = $this->app->make(SkillPublishing::class);
        $publishing->refresh();
        $few = $this->readCounts(fn () => $publishing->refresh());

        $this->seedSkills(10, 990);
        $publishing->refresh();
        $many = $this->readCounts(fn () => $publishing->refresh());

        $this->assertSame($few->queriesRun, $many->queriesRun);
        $this->assertSame(2 * 1_000 + 3 * self::SESSIONS + 1 + 2, $many->modelsLoaded);
    }

    private function seedSkillsAndSessions(int $skills): void
    {
        $this->seedSkills(0, $skills);

        foreach (range(1, self::SESSIONS) as $number) {
            $agent = Agent::named("Agent {$number}", 'main-agent');
            $session = new AgentSession(TestSelections::sessionColumns());
            $session->agent_id = $agent->id;
            $session->status = SessionStatus::Active;
            $session->save();
        }
    }

    private function seedSkills(int $from, int $count): void
    {
        $author = TestActors::userIdentity(7);

        foreach (range($from + 1, $from + $count) as $number) {
            $skill = Skill::start(SkillKey::from("user-load-{$number}"), $author, null);
            $skill->appendRevision(
                new SkillDraft(
                    "Load {$number}",
                    'A load skill.',
                    [new SectionDraft('body', 'Body', "Text {$number}.")],
                    '',
                ),
                Conditions::everyone(),
                $author,
            );
        }
    }
}
