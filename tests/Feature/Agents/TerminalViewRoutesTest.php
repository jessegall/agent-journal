<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Support\ActorIdentity;
use App\Agents\Actions\AgentRuntimes;
use App\Agents\Actions\AgentSessions;
use App\Agents\Actions\StartSessions;
use App\Agents\Data\ScreenFrameData;
use App\Agents\Enums\DriverVariant;
use App\Agents\Exceptions\TerminalViewRefused;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentRuntime;
use App\Agents\Models\TerminalView;
use App\Agents\Support\DriverRequestEndings;
use App\Agents\Support\RuntimeScreen;
use App\Agents\Support\TerminalFrames;
use App\Agents\Values\RuntimeIntent;
use App\Http\Responses\Agents\TerminalViewResponses;
use Carbon\CarbonImmutable;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Symfony\Component\HttpFoundation\Response;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\OpensTerminalRuntimes;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestActors;
use Tests\Support\TestStartAuthority;
use Tests\TestCase;

/**
 * A signed-in viewer opens, renews and closes their view of an agent's terminal and polls its frames: a refusal
 * answers its message with a fitting status, a frame is served once and then 204, and a stopped or restarted
 * runtime says so.
 */
final class TerminalViewRoutesTest extends TestCase
{
    use OpensTerminalRuntimes;
    use RefreshHookDatabase;

    private User $owner;

    protected function setUp(): void
    {
        parent::setUp();
        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
    }

    public function test_the_owner_opens_renews_and_closes_a_view(): void
    {
        $runtime = $this->runtimeOn('host-1');
        $agentId = $runtime->session->agent_id;

        $opened = $this->actingAs($this->owner)->postJson("/agents/{$agentId}/terminal", ['intervalMs' => 1000]);
        $opened->assertOk()->assertJson([
            'runtimeId' => $runtime->id,
            'intervalMs' => 1000,
            'expiresInSeconds' => 30,
        ]);

        $this->actingAs($this->owner)->putJson("/agents/{$agentId}/terminal")
            ->assertOk()
            ->assertJson(['viewId' => $opened->json('viewId')]);

        $this->actingAs($this->owner)->deleteJson("/agents/{$agentId}/terminal")->assertNoContent();
        $this->assertSame(0, TerminalView::query()->acrossActors()->live()->count());
    }

    public function test_each_refusal_answers_its_message_and_status(): void
    {
        $process = $this->runtimeOn('host-1', DriverVariant::Headless);
        $stopped = $this->runtimeOn('host-1');
        $this->app->make(DriverRequestEndings::class)->closeAfterExit($stopped);

        $this->assertRefusal($process->session->agent_id, 422, 'This agent runs without a terminal');
        $this->assertRefusal($stopped->session->agent_id, 409, 'This agent is not running');
        $this->assertRefusal('01jzzzzzzzzzzzzzzzzzzzzzzz', 403, 'You may not inspect this agent');

        $stranger = User::factory()->create();
        $this->actingAs($stranger)->postJson("/agents/{$process->session->agent_id}/terminal")->assertForbidden();
        $this->assertSame(0, TerminalView::query()->acrossActors()->count());
    }

    public function test_too_many_views_answers_429(): void
    {
        $runtime = $this->runtimeOn('host-1');

        for ($view = 0; $view < TerminalView::MAX_PER_VIEWER; $view++) {
            TerminalView::create($this->viewerOf($this->owner), $runtime, 500, CarbonImmutable::now());
        }

        $this->assertRefusal($runtime->session->agent_id, 429, 'You may have at most 20 terminal views open');
    }

    public function test_a_stored_frame_is_served_once_and_then_204(): void
    {
        $runtime = $this->runtimeOn('host-1');
        $agentId = $runtime->session->agent_id;
        $this->actingAs($this->owner)->postJson("/agents/{$agentId}/terminal")->assertOk();

        $this->actingAs($this->owner)->getJson("/agents/{$agentId}/terminal")->assertNoContent();
        $this->storeFrame($runtime, 'epoch-1', 3);

        $this->actingAs($this->owner)->getJson("/agents/{$agentId}/terminal")
            ->assertOk()
            ->assertJson(['state' => 'live', 'frame' => ['epoch' => 'epoch-1', 'sequence' => 3]])
            ->assertJsonPath('frame.rows.0.runs.0.text', '<script>');
        $this->actingAs($this->owner)->getJson("/agents/{$agentId}/terminal?epoch=epoch-1&after=3")->assertNoContent();
        $this->actingAs($this->owner)->getJson("/agents/{$agentId}/terminal?epoch=epoch-0&after=9")->assertOk();
    }

    public function test_a_viewer_who_may_not_inspect_is_refused_and_loses_the_view(): void
    {
        $runtime = $this->runtimeOn('host-1');
        $agentId = $runtime->session->agent_id;
        $viewer = TestActors::agentIdentity(9);
        $view = TerminalView::create($viewer, $runtime, 500, CarbonImmutable::now());
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forAgent($viewer->id),
            TestStartAuthority::forAgent($viewer->id),
        );
        $frames = $this->app->make(TerminalFrames::class);

        $this->assertThrows(
            fn () => $this->app->make(TerminalViewResponses::class)->answer(
                $agentId,
                fn () => $frames->after($agentId, '', 0)->getOrCall(fn () => new Response()),
            ),
            TerminalViewRefused::class,
            'You may not inspect this agent',
        );

        $this->assertFalse($view->refresh()->isLive());
    }

    public function test_a_stopped_runtime_says_ended_with_its_last_frame(): void
    {
        $runtime = $this->runtimeOn('host-1');
        $agentId = $runtime->session->agent_id;
        $this->actingAs($this->owner)->postJson("/agents/{$agentId}/terminal")->assertOk();
        $this->storeFrame($runtime, 'epoch-1', 1);
        $this->app->make(DriverRequestEndings::class)->closeAfterExit($runtime);

        $this->actingAs($this->owner)->getJson("/agents/{$agentId}/terminal?epoch=epoch-1&after=1")
            ->assertOk()
            ->assertJson(['state' => 'ended', 'frame' => ['sequence' => 1]])
            ->assertJsonStructure(['endedAt']);
    }

    public function test_a_new_generation_answers_restarted_once_and_then_its_frames(): void
    {
        $runtime = $this->runtimeOn('host-1');
        $agentId = $runtime->session->agent_id;
        $this->actingAs($this->owner)->postJson("/agents/{$agentId}/terminal")->assertOk();
        $runtime->reassignTo('host-2', 'start-token-2');
        $this->storeFrame($runtime, 'epoch-2', 1);

        $this->actingAs($this->owner)->getJson("/agents/{$agentId}/terminal")
            ->assertOk()
            ->assertExactJson(['state' => 'restarted']);
        $this->actingAs($this->owner)->getJson("/agents/{$agentId}/terminal")
            ->assertOk()
            ->assertJson(['state' => 'live', 'frame' => ['epoch' => 'epoch-2']]);
        $view = TerminalView::query()->acrossActors()->sole();
        $this->assertSame($runtime->process_generation, $view->process_generation);
    }

    public function test_a_view_of_a_session_the_agent_left_ends_instead_of_following_the_replacement(): void
    {
        $old = $this->runtimeOn('host-1');
        $agent = Agent::query()->findOrFail($old->session->agent_id);
        $this->actingAs($this->owner)->postJson("/agents/{$agent->id}/terminal")->assertOk();
        $this->app->make(AgentSessions::class)->end($old->session);
        $agent->fenceRuntimes();
        $replacement = $this->app->make(StartSessions::class)
            ->start($agent, TestSelections::of('claude-code'), TestSelections::requestId());
        $intent = new RuntimeIntent('host-1', base_path(), 'claude', '1.0.0', 'default', DriverVariant::Terminal, null, null, null);
        $this->app->make(AgentRuntimes::class)->open($replacement->session, $intent, 'start-token-2');

        $this->actingAs($this->owner)->getJson("/agents/{$agent->id}/terminal")
            ->assertOk()
            ->assertJson(['state' => 'ended']);
        $this->assertSame(0, TerminalView::query()->acrossActors()->live()->count());
    }

    private function assertRefusal(string $agentId, int $status, string $message): void
    {
        $before = TerminalView::query()->acrossActors()->count();

        $response = $this->actingAs($this->owner)->postJson("/agents/{$agentId}/terminal");

        $response->assertStatus($status);
        $this->assertStringStartsWith($message, (string) $response->json('message'));
        $this->assertSame($before, TerminalView::query()->acrossActors()->count());
    }

    private function storeFrame(AgentRuntime $runtime, string $epoch, int $sequence): void
    {
        $frame = ScreenFrameData::from([
            'epoch' => $epoch,
            'sequence' => $sequence,
            'captured' => '2026-11-19T12:00:00Z',
            'columns' => 20,
            'rows' => [[['text' => '<script>']]],
            'cursor' => ['row' => 0, 'column' => 8, 'visible' => true],
            'buffer' => 'normal',
            'plain' => false,
            'too_large' => false,
            'unreadable' => false,
            'no_terminal' => false,
        ]);
        $this->app->make(RuntimeScreen::class)->put($runtime->id, $frame, CarbonImmutable::now());
    }

    private function viewerOf(User $user): ActorIdentity
    {
        return ActorIdentity::of(ActorContext::forUser($user->id));
    }
}
