<?php

declare(strict_types=1);

namespace Tests\Feature\Skills;

use App\Commands\Profiles\ActivateProfiles\ActivateProfilesCommand;
use App\Contracts\Bus\CommandBus;
use App\Enums\Sessions\SessionStatus;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Models\Profiles\Profile;
use App\Models\Profiles\ProfileRevision;
use App\Support\Access\AccessSettings;
use App\Values\ProfileBase;
use Illuminate\Support\Facades\Artisan;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Fixtures\Profiles\TestProposals;
use Tests\Support\ActsAsActors;
use Tests\Support\Agents\HasContainerSupport;
use Tests\Support\CommitsHookRows;
use Tests\Support\InstallsBuiltInProfiles;
use Tests\Support\TestActors;
use Tests\TestCase;

/**
 * skill:preview explains who a skill reaches: the main agent matches journal-plans, a read-only helper does not, each
 * with its reason, and the preview changes no row.
 */
final class SkillPreviewTest extends TestCase
{
    use ActsAsActors;
    use CommitsHookRows;
    use HasContainerSupport;
    use InstallsBuiltInProfiles;

    private const array TABLES = ['agent_sessions', 'agents', 'profile_revisions', 'profiles'];

    private Agent $main;

    private Agent $reviewer;

    protected function setUp(): void
    {
        parent::setUp();

        $this->app->instance(AccessSettings::class, TestActors::accessSettings(7));
        $this->actAs(TestActors::user(7));
        $this->app->make(CommandBus::class)->run(new ActivateProfilesCommand(TestProposals::of(
            TestProposals::profile('journal-reviewer', ProfileBase::readOnlyHelper(), 'Review.'),
        )));
        $this->main = $this->start('Main', 'main-agent', null);
        $this->reviewer = $this->start('Reviewer', 'read-only-helper', 1);
    }

    public function test_journal_plans_lists_the_main_agent_as_match_and_a_read_only_helper_as_no_match(): void
    {
        $before = $this->rowCounts();

        Artisan::call('skill:preview', ['key' => 'journal-plans', '--json' => true]);
        $preview = json_decode(Artisan::output(), true, flags: JSON_THROW_ON_ERROR);
        $byAgent = array_column($preview['agents'], null, 'agent');

        $this->assertSame('match', $byAgent[$this->main->id]['outcome']);
        $this->assertSame('grants-held', $byAgent[$this->main->id]['reason']);
        $this->assertSame('no_match', $byAgent[$this->reviewer->id]['outcome']);
        $this->assertSame('none-matched', $byAgent[$this->reviewer->id]['reason']);
        $this->assertSame($before, $this->rowCounts());
    }

    public function test_an_everyone_skill_says_it_reaches_everyone_and_one_agent_shows_its_selection(): void
    {
        $this->artisan(
            'skill:preview',
            ['key' => 'journal-skills'],
        )->expectsOutputToContain('everyone in the authorized installation scope')->assertSuccessful();

        Artisan::call('skill:preview', ['key' => 'journal-plans', '--agent' => $this->reviewer->id, '--json' => true]);
        $answer = json_decode(Artisan::output(), true, flags: JSON_THROW_ON_ERROR);

        $this->assertFalse($answer['selected']);
        $this->assertSame('no_match:none-matched', $answer['reason']);
        $this->assertContains('journal-skills', $answer['selection']);
    }

    public function test_an_unknown_key_is_named(): void
    {
        $this->artisan(
            'skill:preview',
            ['key' => 'journal-nothing'],
        )->expectsOutputToContain('There is no skill journal-nothing.')->assertFailed();
    }

    /**
     * @return list<int>
     */
    private function rowCounts(): array
    {
        return [
            Agent::query()->count(),
            AgentSession::query()->count(),
            Profile::query()->count(),
            ProfileRevision::query()->count(),
        ];
    }

    private function start(string $name, string $profileKey, int|null $profileRevision): Agent
    {
        $agent = Agent::create($name, $profileKey);
        $session = new AgentSession(
            [
                ...TestSelections::sessionColumns(),
                'profile_key' => $profileRevision === null ? 'main-agent' : 'journal-reviewer',
                'profile_revision' => $profileRevision ?? 1,
            ],
        );
        $session->agent_id = $agent->id;
        $session->status = SessionStatus::Active;
        $session->save();

        return $agent;
    }
}
