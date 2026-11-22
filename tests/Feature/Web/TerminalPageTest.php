<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Exceptions\ActorNotAllowed;
use App\Actors\Support\ActorContext;
use App\Actors\Support\ActorIdentity;
use App\Agents\Actions\AgentRuntimes;
use App\Agents\Actions\AgentSessions;
use App\Agents\Actions\StartSessions;
use App\Agents\Data\ScreenFrameData;
use App\Agents\Enums\DriverVariant;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentRuntime;
use App\Agents\Models\TerminalView;
use App\Agents\Support\DriverRequestEndings;
use App\Agents\Support\RuntimeScreen;
use App\Agents\Support\ScreenRegistration;
use App\Agents\Support\TerminalFrames;
use App\Agents\Values\RuntimeIntent;
use App\Http\Middleware\Web\HandleInertiaRequests;
use Carbon\CarbonImmutable;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\OpensTerminalRuntimes;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestActors;
use Tests\Support\TestStartAuthority;
use Tests\TestCase;

/**
 * A signed-in viewer opens and renews their view of an agent's terminal from its page and reloads the page's data for
 * its frames: a refusal is shown on the page, a frame is served once and then left out, and a stopped or restarted
 * runtime says so.
 */
final class TerminalPageTest extends TestCase
{
    use OpensTerminalRuntimes;
    use RefreshHookDatabase;

    private User $owner;

    private string $openRequestId = '';

    protected function setUp(): void
    {
        parent::setUp();
        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
    }

    public function test_the_owner_opens_and_renews_a_view_from_the_page(): void
    {
        $runtime = $this->runtimeOn('host-1');
        $agentId = $runtime->session->agent_id;

        $this->open($agentId, ['intervalMs' => 1000])->assertStatus(303)->assertSessionHasNoErrors();
        $view = TerminalView::query()->acrossActors()->live()->sole();
        $this->assertSame(1000, $view->interval_ms);

        $this->actingAs($this->owner)
            ->post("/web/agents/{$agentId}/terminal/renew", ['interest' => $view->read_interest_id])
            ->assertStatus(303)
            ->assertSessionHasNoErrors();
        $this->assertSame($view->id, TerminalView::query()->acrossActors()->live()->sole()->id);
    }

    public function test_the_page_learns_the_id_of_the_interest_its_open_request_opened(): void
    {
        $runtime = $this->runtimeOn('host-1');
        $agentId = $runtime->session->agent_id;
        $this->open($agentId)->assertSessionHasNoErrors();
        $view = TerminalView::query()->acrossActors()->live()->sole();

        $this->frame($agentId, "?request={$this->openRequestId}")
            ->assertJsonPath('props.page.data.readInterestId', $view->read_interest_id)
            ->assertJsonMissingPath('props.page.data.frame');
    }

    public function test_each_refusal_is_shown_on_the_page(): void
    {
        $process = $this->runtimeOn('host-1', DriverVariant::Headless);
        $stopped = $this->runtimeOn('host-1');
        $this->app->make(DriverRequestEndings::class)->closeAfterExit($stopped);

        $this->assertRefusal($process->session->agent_id, 'This agent runs without a terminal');
        $this->assertRefusal($stopped->session->agent_id, 'This agent is not running');
        $this->assertRefusal('01jzzzzzzzzzzzzzzzzzzzzzzz', 'You may not inspect this agent');

        $stranger = User::factory()->create();
        $this->actingAs($stranger)->post("/web/agents/{$process->session->agent_id}/terminal/open")->assertForbidden();
        $this->assertSame(0, TerminalView::query()->acrossActors()->count());
    }

    public function test_too_many_views_are_refused_on_the_page(): void
    {
        $runtime = $this->runtimeOn('host-1');

        for ($view = 0; $view < TerminalView::MAX_PER_VIEWER; $view++) {
            TerminalView::create(
                $this->viewerOf($this->owner),
                $runtime,
                500,
                CarbonImmutable::now(),
                (string) Str::ulid(),
            );
        }

        $this->assertRefusal($runtime->session->agent_id, 'You may have at most 20 terminal views open');
    }

    public function test_a_stored_frame_is_served_once_and_then_left_out(): void
    {
        $runtime = $this->runtimeOn('host-1');
        $agentId = $runtime->session->agent_id;
        $this->open($agentId)->assertSessionHasNoErrors();

        $this->frame($agentId)->assertJsonMissingPath('props.page.data.frame');
        $this->storeFrame($runtime, 'epoch-1', 3);

        $this->frame($agentId)
            ->assertJsonPath('props.page.data.frame.state', 'live')
            ->assertJsonPath('props.page.data.frame.frame.epoch', 'epoch-1')
            ->assertJsonPath('props.page.data.frame.frame.sequence', 3)
            ->assertJsonPath('props.page.data.frame.frame.rows.0.runs.0.text', '<script>');
        $this->frame($agentId, '?epoch=epoch-1&after=3')->assertJsonMissingPath('props.page.data.frame');
        $this->frame($agentId, '?epoch=epoch-0&after=9')->assertJsonPath('props.page.data.frame.frame.sequence', 3);
    }

    public function test_a_viewer_who_may_not_inspect_is_refused_its_frames(): void
    {
        $runtime = $this->runtimeOn('host-1');
        $agentId = $runtime->session->agent_id;
        $viewer = TestActors::agentIdentity(9);
        $view = TerminalView::create($viewer, $runtime, 500, CarbonImmutable::now(), (string) Str::ulid());
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forAgent($viewer->id),
            TestStartAuthority::forAgent($viewer->id),
        );
        $frames = $this->app->make(TerminalFrames::class);

        $this->assertThrows(fn () => $frames->after($agentId, $view->read_interest_id, '', 0), ActorNotAllowed::class);
        $this->assertTrue($view->refresh()->isLive());
    }

    public function test_a_stopped_runtime_says_ended_with_its_last_frame(): void
    {
        $runtime = $this->runtimeOn('host-1');
        $agentId = $runtime->session->agent_id;
        $this->open($agentId)->assertSessionHasNoErrors();
        $this->storeFrame($runtime, 'epoch-1', 1);
        $this->app->make(DriverRequestEndings::class)->closeAfterExit($runtime);

        $this->frame($agentId, '?epoch=epoch-1&after=1')
            ->assertJsonPath('props.page.data.frame.state', 'ended')
            ->assertJsonPath('props.page.data.frame.frame.sequence', 1)
            ->assertJsonStructure(['props' => ['page' => ['data' => ['frame' => ['endedAt']]]]]);
    }

    public function test_a_new_generation_answers_restarted_once_and_then_its_frames(): void
    {
        $runtime = $this->runtimeOn('host-1');
        $agentId = $runtime->session->agent_id;
        $this->open($agentId)->assertSessionHasNoErrors();
        $runtime->reassignTo('host-2', 'start-token-2');
        $this->storeFrame($runtime, 'epoch-2', 1);

        $this->frame($agentId)->assertJsonPath('props.page.data.frame', ['state' => 'restarted']);
        $this->frame($agentId)
            ->assertJsonPath('props.page.data.frame.state', 'live')
            ->assertJsonPath('props.page.data.frame.frame.epoch', 'epoch-2');
        $view = TerminalView::query()->acrossActors()->sole();
        $this->assertSame($runtime->process_generation, $view->process_generation);
    }

    public function test_a_view_of_a_session_the_agent_left_ends_instead_of_following_the_replacement(): void
    {
        $old = $this->runtimeOn('host-1');
        $agent = Agent::query()->findOrFail($old->session->agent_id);
        $this->open($agent->id)->assertSessionHasNoErrors();
        $this->app->make(AgentSessions::class)->end($old->session);
        $agent->fenceRuntimes();
        $replacement = $this->app->make(StartSessions::class)
            ->start($agent, TestSelections::of('claude-code'), TestSelections::requestId());
        $intent = new RuntimeIntent('host-1', base_path(), 'claude', '1.0.0', 'default', DriverVariant::Terminal, null, null, null);
        $this->app->make(AgentRuntimes::class)->open($replacement->session, $intent, 'start-token-2');

        $this->frame($agent->id)->assertJsonPath('props.page.data.frame.state', 'ended');
        $this->assertSame(0, TerminalView::query()->acrossActors()->live()->count());
    }

    private function assertRefusal(string $agentId, string $message): void
    {
        $before = TerminalView::query()->acrossActors()->count();

        $this->open($agentId)->assertStatus(303)->assertSessionHasErrors('review');

        $this->assertStringStartsWith($message, (string) session('errors')->first('review'));
        $this->assertSame($before, TerminalView::query()->acrossActors()->count());
    }

    /**
     * @param  array<string, int>  $body
     */
    private function open(string $agentId, array $body = []): TestResponse
    {
        $this->openRequestId = (string) Str::ulid();

        return $this->actingAs($this->owner)
            ->post("/web/agents/{$agentId}/terminal/open", [...$body, 'requestId' => $this->openRequestId]);
    }

    /**
     * The terminal page's data as the page reloads it, through the interest the last open opened, with the frame the
     * viewer holds in the query; a query that names the open request asks for the interest's id instead.
     */
    private function frame(string $agentId, string $held = ''): TestResponse
    {
        $interest = TerminalView::query()->acrossActors()->openedBy($this->openRequestId)->value('read_interest_id');
        $query = str_starts_with($held, '?request=') ? $held : '?interest='.$interest.str_replace('?', '&', $held);
        $uri = "/web/agents/{$agentId}/terminal{$query}";

        return $this->actingAs($this->owner)->get($uri, [
            'X-Inertia' => 'true',
            'X-Inertia-Version' => (string) $this->app->make(HandleInertiaRequests::class)->version(Request::create($uri)),
            'X-Inertia-Partial-Component' => 'web/TerminalWindow',
            'X-Inertia-Partial-Data' => 'page',
        ])->assertOk();
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
        $this->app->make(RuntimeScreen::class)->admit(ScreenRegistration::of($runtime), $frame, CarbonImmutable::now());
    }

    private function viewerOf(User $user): ActorIdentity
    {
        return ActorIdentity::of(ActorContext::forUser($user->id));
    }
}
