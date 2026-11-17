<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use App\Core\Agents\LaunchSessions;
use App\Core\Agents\Models\Agent;
use App\Core\Agents\Models\AgentSession;
use App\Domain\Access\AccessSettings;
use App\Domain\Access\Models\User;
use App\Domain\Chat\Models\Message;
use App\Domain\Plans\Api\PlanKind;
use App\Domain\Plans\Models\Plan;
use Inertia\Testing\AssertableInertia;
use Tests\Support\CommitsHookRows;
use Tests\TestCase;

/**
 * Home: the chat with a chosen agent session beside the plans slice, and the composer's send.
 */
final class HomePageTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['users', 'agents', 'agent_sessions', 'launch_credentials', 'agent_stacks', 'hook_calls', 'messages', 'links', 'plans'];

    private User $owner;

    private AgentSession $session;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $agent = Agent::query()->create(['name' => 'Builder', 'role' => 'hooks.main_ready']);
        $this->session = $this->app->make(LaunchSessions::class)->launch($agent, 'claude-code')->session;
        Plan::query()->create(['title' => 'Build the release page', 'kind' => PlanKind::Build]);
    }

    public function test_a_guest_is_sent_to_sign_in(): void
    {
        $this->get('/')->assertRedirect('/login');
    }

    public function test_home_shows_the_running_sessions_and_the_same_plans_slice_as_the_plans_page(): void
    {
        $this->actingAs($this->owner)->get('/?q=release')->assertOk()->assertInertia(fn (AssertableInertia $page) => $page
            ->component('Home')
            ->where('page.chat.sessions.0.id', (string) $this->session->id)
            ->where('page.chat.sessions.0.agentName', 'Builder')
            ->missing('page.chat.conversation')
            ->where('page.plans.filters.q', 'release')
            ->where('page.plans.pagination.total', 1)
            ->missing('page.filters')
            ->missing('page.chatView')
            ->missing('page.plansView'));
    }

    public function test_a_sent_message_keeps_its_indentation_and_returns_to_the_conversation(): void
    {
        $body = "  Please check:\n    - the indented line\n\nthen answer.  \n";

        $this->actingAs($this->owner)->post('/messages', ['body' => $body, 'session' => (string) $this->session->id])
            ->assertStatus(303)
            ->assertRedirect("/?session={$this->session->id}");

        $this->assertSame([$body], Message::query()->ownedBy($this->session->agent_id)->pluck('body')->all());
        $this->actingAs($this->owner)->get("/?session={$this->session->id}")->assertInertia(fn (AssertableInertia $page) => $page
            ->where('page.chat.conversation.id', "{$this->session->agent_id}-{$this->session->id}")
            ->where('page.chat.conversation.sessionId', (string) $this->session->id)
            ->where('page.chat.conversation.messages.0.body', $body));
    }

    public function test_a_blank_message_is_refused_on_its_body(): void
    {
        $this->actingAs($this->owner)->from('/')->post('/messages', ['body' => "  \n\t ", 'session' => (string) $this->session->id])
            ->assertRedirect('/')
            ->assertSessionHasErrors('body');

        $this->assertSame(0, Message::query()->ownedBy($this->session->agent_id)->count());
    }

    public function test_a_guessed_session_is_refused_on_the_session(): void
    {
        $this->actingAs($this->owner)->from('/')->post('/messages', ['body' => 'Hello', 'session' => (string) ($this->session->id + 100)])
            ->assertRedirect('/')
            ->assertSessionHasErrors('session');
    }
}
