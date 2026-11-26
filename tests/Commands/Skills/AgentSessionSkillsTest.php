<?php

declare(strict_types=1);

namespace Tests\Commands\Skills;

use App\Events\Sessions\AgentSessionSkillsGenerated;
use App\Models\Agents\AgentSession;
use App\Models\Skills\SkillGeneration;
use App\Profiles\BuiltInAuthorizations;
use App\Profiles\Enums\ModelTier;
use App\Skills\Data\GeneratedSkillData;
use App\Skills\Enums\GenerationStatus;
use App\Skills\Values\StartProfile;
use App\Values\ProfileBase;
use App\Values\ProfileKey;
use App\Values\ProfileSnapshot;
use Tests\Fixtures\Profiles\TestStartPolicies;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A session keeps the generation and the skill keys its start was handed, raises one event with both, and answers
 * which keys it was handed and which of its profile's required keys among them, in the profile's order.
 */
final class AgentSessionSkillsTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_recording_the_skills_saves_the_generation_and_the_keys_and_raises_one_event(): void
    {
        $this->journal->owner()->idleAgent('Writer')->startSession('Writer', 'First');
        $session = $this->journal->sessionCalled('First');
        $generation = $this->generation();

        $session->takeRaisedEvents();
        $session->recordSkills($generation, ['journal', 'journal-plans']);

        $stored = AgentSession::findById($session->id);
        $this->assertSame($generation->id, $stored->skill_generation_id);
        $this->assertSame(['journal', 'journal-plans'], $stored->skill_keys);

        $events = $session->takeRaisedEvents();
        $this->assertCount(1, $events);
        $this->assertInstanceOf(AgentSessionSkillsGenerated::class, $events[0]);
        $this->assertSame($generation->id, $events[0]->generationId);
        $this->assertSame(['journal', 'journal-plans'], $events[0]->skillKeys);
    }

    public function test_a_session_has_only_the_skills_its_start_handed_it(): void
    {
        $session = new AgentSession();
        $session->skill_keys = ['journal'];

        $this->assertTrue($session->hasSkill('journal'));
        $this->assertFalse($session->hasSkill('journal-plans'));
        $this->assertFalse(new AgentSession()->hasSkill('journal'));
    }

    public function test_the_required_keys_are_those_of_the_profile_the_session_was_handed_in_profile_order(): void
    {
        $session = new AgentSession();
        $session->skill_keys = ['journal-plans', 'journal', 'journal-tasks'];

        $profile = $this->profileRequiring(['journal', 'journal-memory', 'journal-plans']);

        $this->assertSame(['journal', 'journal-plans'], $session->requiredSkillKeys($profile));
        $this->assertSame([], $session->requiredSkillKeys(StartProfile::profileFree()));
    }

    private function generation(): SkillGeneration
    {
        $entries = GeneratedSkillData::collect([
            [
                'key' => 'journal',
                'owner' => 'Core',
                'revision' => null,
                'markdown' => "# Journal\n",
                'digest' => hash('sha256', "# Journal\n"),
            ],
        ]);

        return SkillGeneration::create(str_repeat('e', 64), GenerationStatus::Ready, hash('sha256', 'text'), $entries, null);
    }

    /**
     * @param  list<string>  $required
     */
    private function profileRequiring(array $required): StartProfile
    {
        return StartProfile::of(ProfileSnapshot::from([
            'key' => ProfileKey::from('journal-reviewer'),
            'revision' => 1,
            'base' => ProfileBase::readOnlyHelper(),
            'instructions' => 'Review.',
            'preferredTier' => ModelTier::Inventive,
            'skillAllowlist' => null,
            'requiredSkills' => $required,
            'start' => TestStartPolicies::for(ProfileBase::readOnlyHelper()),
            'authorization' => BuiltInAuthorizations::for(ProfileBase::readOnlyHelper()),
        ]));
    }
}
