<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use App\Models\Agents\Agent;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use App\Support\ActorIdentity;
use App\Support\DomainRegistry;
use App\Support\StartSessions;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Models\Plan;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * Home: the chat with a chosen agent beside the plans slice, and the composer's send.
 */
final class HomePageTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'users',
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'hook_calls',
        'messages',
        'links',
        'plans',
        'rules',
        'inboxes', 'inbox_members',
        'assignments',
        'command_receipts',
    ];

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainRegistry::installedClasses(dirname(__DIR__, 3));
    }

    private string $chatInboxId;

    private int $sends = 0;

    private AgentSession $session;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();
        $agent = $this->journal->idleAgent('Chat builder', 'main-agent')->agentCalled('Chat builder');
        $this->session = $this->app->make(StartSessions::class)->start(
            $agent,
            TestSelections::of('claude-code'),
            TestSelections::requestId(),
        )->session;
        $this->chatInboxId = $this->journal->inboxes()->pairChat(
            ActorIdentity::of($this->journal->ownerUser()),
            ActorIdentity::of($agent),
        )->id;
        Plan::factory()->create(['title' => 'Build the release page', 'type' => PlanType::Build]);
    }

    public function test_a_stale_send_answers_json_with_409_and_its_code_and_flashes_the_code_to_a_form(): void
    {
        $outdated = [...$this->pair(), 'body' => 'Still there?', ...$this->seenSession(), 'expectedGeneration' => 99];

        $this->actingAs($this->journal->ownerUser())->postJson('/chat/messages', $outdated)
            ->assertStatus(409)
            ->assertJson(['code' => 'stale-generation']);
        $this->actingAs($this->journal->ownerUser())->from('/')->post('/chat/messages', $outdated)
            ->assertRedirect('/')
            ->assertSessionHasErrors('session')
            ->assertSessionHas('refusal_code', 'stale-generation');
    }

    public function test_refused_input_answers_json_with_422_and_its_fields(): void
    {
        $this->actingAs($this->journal->ownerUser())
            ->postJson('/chat/messages', [...$this->pair(), 'body' => '  ', ...$this->seenSession()])
            ->assertStatus(422)
            ->assertJson(['code' => 'invalid-input'])
            ->assertJsonStructure(['message', 'fields' => ['body']]);
    }

    public function test_a_denied_target_answers_json_with_403_and_an_expired_sign_in_with_401(): void
    {
        $guessed = [...$this->pair(), 'inboxId' => TestIds::of(99999), 'body' => 'Hello'];

        $this->actingAs($this->journal->ownerUser())->postJson('/chat/messages', [...$guessed, ...$this->seenSession()])
            ->assertStatus(403)
            ->assertJson(['code' => 'inbox-unavailable']);
        $this->app['auth']->forgetGuards();
        $this->postJson('/chat/messages', [...$guessed, ...$this->seenSession()])
            ->assertStatus(401)
            ->assertJson(['code' => 'signed-out']);
    }

    /**
     * The pair's chat inbox and a request key of the send's own.
     *
     * @return array{inboxId: string, requestKey: string}
     */
    private function pair(): array
    {
        return ['inboxId' => $this->chatInboxId, 'requestKey' => 'home-send-'.++$this->sends];
    }

    /**
     * The agent a send goes to and the session the sender saw it run.
     *
     * @return array{agent: string, expectedSessionId: string, expectedGeneration: int}
     */
    private function seenSession(): array
    {
        return [
            'agent' => $this->session->agent_id,
            'expectedSessionId' => $this->session->id,
            'expectedGeneration' => AgentRuntime::findForSession($this->session->id)?->process_generation ?? 0,
        ];
    }
}
