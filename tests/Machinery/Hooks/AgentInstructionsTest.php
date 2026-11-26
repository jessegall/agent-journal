<?php

declare(strict_types=1);

namespace Tests\Machinery\Hooks;

use App\Bus\Contracts\CommandBus;
use App\Events\Hooks\ContextStarted;
use App\Hooks\Enums\ContextStartType;
use App\Hooks\ReminderContribution;
use App\Listeners\RemindAgentInstructions;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Profiles\Commands\ActivateProfiles\ActivateProfilesCommand;
use App\Sessions\Enums\SessionStatus;
use App\Values\ProfileBase;
use App\Values\StackTarget;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Fixtures\Profiles\TestProposals;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * Each time an agent's context starts it is told how it works with the journal, then its own profile's instructions,
 * so a chat message costs it only the message.
 */
#[TestsMachinery(RemindAgentInstructions::class)]
final class AgentInstructionsTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_each_session_is_told_how_the_chat_works_and_its_own_profiles_instructions(): void
    {
        $this->journal->actAsUserId(TestIds::of(7));
        $this->app->make(CommandBus::class)->run(new ActivateProfilesCommand(TestProposals::of(
            TestProposals::profile('journal-reviewer', ProfileBase::readOnlyHelper(), 'Review_carefully.'),
            TestProposals::profile('journal-researcher', ProfileBase::readOnlyHelper(), 'Cite_sources.'),
        )));

        $reviewer = $this->remindersOf($this->sessionOn('journal-reviewer'));
        $researcher = $this->remindersOf($this->sessionOn('journal-researcher'));

        $this->assertSame($reviewer[0], $researcher[0]);
        $this->assertStringContainsString('Review_carefully.', $reviewer[1]);
        $this->assertStringContainsString('Cite_sources.', $researcher[1]);
    }

    private function sessionOn(string $profile): AgentSession
    {
        $agent = $this->journal->idleAgent(ucfirst($profile), 'read-only-helper')->agentCalled(ucfirst($profile));
        $session = new AgentSession()->forceFill([
            ...TestSelections::sessionColumns(),
            'profile_key' => $profile,
            'profile_revision' => 1,
        ]);
        $session->agent_id = $agent->id;
        $session->status = SessionStatus::Active;
        $session->save();

        return $session;
    }

    /**
     * @return list<string>
     */
    private function remindersOf(AgentSession $session): array
    {
        $this->app->forgetScopedInstances();
        $reminders = $this->app->make(ReminderContribution::class);
        $event = new ContextStarted(
            new StackTarget($session->agent_id, $session->id),
            'hook-'.bin2hex(random_bytes(4)),
            ContextStartType::Start,
            $reminders,
        );
        $this->app->make(RemindAgentInstructions::class)->handle($event);

        return $reminders->all();
    }
}
