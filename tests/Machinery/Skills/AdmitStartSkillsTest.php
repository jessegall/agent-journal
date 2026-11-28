<?php

declare(strict_types=1);

namespace Tests\Machinery\Skills;

use App\Bus\Contracts\CommandBus;
use App\Events\Sessions\SessionOpened;
use App\Exceptions\StartRefused;
use App\Listeners\AdmitStartSkills;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Models\Skills\SkillGeneration;
use App\Profiles\Commands\ActivateProfiles\ActivateProfilesCommand;
use App\Sessions\Enums\SessionStatus;
use App\Skills\Exceptions\SkillSelectionConflict;
use App\Support\DomainRegistry;
use App\Values\ProfileBase;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Fixtures\Profiles\TestProposals;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * A start's admission records the generation and the selected keys the generation holds with its session; a driver
 * without a skill adapter and a required skill outside the selection still refuse; before the first refresh nothing
 * is recorded and the start goes ahead.
 */
#[TestsMachinery(AdmitStartSkills::class)]
final class AdmitStartSkillsTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'skill_generations',
        'command_receipts',
        'profile_revisions',
        'profiles',
        'agents',
        'agent_sessions',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->installProfiles();
    }

    /**
     * Every installed domain, since the skills this test names come from them.
     */
    protected static function bootedDomains(): array
    {
        return DomainRegistry::installedClasses(dirname(__DIR__, 3));
    }

    public function test_the_session_row_holds_the_generation_and_the_selected_keys_the_generation_holds(): void
    {
        $this->journal->refreshSkills();
        $generation = SkillGeneration::findLatestReady();
        $this->assertNotNull($generation);

        $session = $this->started($this->handedSession(TestSelections::sessionColumns()));

        $keys = AgentSession::findById($session->id)->skill_keys;
        $this->assertNotEmpty($keys);

        foreach ($keys as $key) {
            $this->assertNotNull($generation->entry($key), "The generation holds no entry for {$key}.");
        }

        $this->journal->assertSkillsHanded($session, $generation, $keys);
    }

    public function test_before_the_first_refresh_nothing_is_recorded_and_the_start_goes_ahead(): void
    {
        $session = $this->started($this->handedSession(TestSelections::sessionColumns()));

        $stored = AgentSession::findById($session->id);
        $this->assertNull($stored->skill_generation_id);
        $this->assertSame([], $stored->skill_keys);
    }

    public function test_a_driver_without_a_skill_adapter_is_refused(): void
    {
        $this->journal->refreshSkills();
        $session = $this->handedSession([...TestSelections::sessionColumns(), 'driver_key' => 'no-such-driver']);

        $this->expectException(StartRefused::class);

        $this->started($session);
    }

    public function test_a_required_skill_outside_the_selection_is_refused_with_its_key(): void
    {
        $this->journal->refreshSkills();
        $this->journal->actAsUserId(TestIds::of(7));
        $this->app->make(CommandBus::class)->run(new ActivateProfilesCommand(TestProposals::of(
            TestProposals::profile(
                'journal-reviewer',
                ProfileBase::readOnlyHelper(),
                'Review.',
                requiredSkills: ['no-such-skill'],
            ),
        )));
        $session = $this->handedSession([
            ...TestSelections::sessionColumns(),
            'profile_key' => 'journal-reviewer',
            'profile_revision' => 1,
        ]);

        $this->expectException(SkillSelectionConflict::class);
        $this->expectExceptionMessage('no-such-skill');

        $this->started($session);
    }

    /**
     * @param  array<string, mixed>  $columns
     */
    private function handedSession(array $columns): AgentSession
    {
        $agent = Agent::create('Reviewer', 'read-only-helper', $this->localProject());
        $session = new AgentSession()->forceFill($columns);
        $session->agent_id = $agent->id;
        $session->status = SessionStatus::Active;
        $session->save();

        return $session;
    }

    private function started(AgentSession $session): AgentSession
    {
        $this->app->make(AdmitStartSkills::class)->handle(new SessionOpened($session->agent_id, $session->id));

        return $session;
    }
}
