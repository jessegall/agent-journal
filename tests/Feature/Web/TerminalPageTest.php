<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use App\Contracts\Actors\CurrentActorSetter;
use App\Data\Terminals\ScreenFrameData;
use App\Enums\Drivers\DriverType;
use App\Enums\Terminals\TerminalFrameState;
use App\Enums\Terminals\TerminalViewRefusal;
use App\Exceptions\ActorNotAllowed;
use App\Http\Middleware\Web\HandleInertiaRequests;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\TerminalView;
use App\Support\ActorContext;
use App\Support\ActorIdentity;
use App\Support\AgentRuntimes;
use App\Support\AgentSessions;
use App\Support\DriverRequestEndings;
use App\Support\HeldFrame;
use App\Support\RuntimeScreen;
use App\Support\ScreenRegistration;
use App\Support\StartSessions;
use App\Support\TerminalFrames;
use App\Values\RuntimeIntent;
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
 * A signed-in viewer's terminal page carries only the agent; its controller opens and renews a read interest through
 * the terminal's JSON actions and reads its frames there: a refusal answers its code, a frame is served once and then
 * answered unchanged, and a stopped or restarted runtime says so.
 */
final class TerminalPageTest extends TestCase
{
    use OpensTerminalRuntimes;
    use RefreshHookDatabase;

    private const string NOT_RUNNING = 'This agent is not running';

    private User $owner;

    private string $readInterestId = '';

    protected function setUp(): void
    {
        parent::setUp();
        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
    }

    public function test_the_page_carries_only_the_agent(): void
    {
        $runtime = $this->runtimeOn('host-1');
        $agentId = $runtime->session->agent_id;
        $uri = "/web/agents/{$agentId}/terminal";

        $this->actingAs($this->owner)->get($uri, [
            'X-Inertia' => 'true',
            'X-Inertia-Version' => (string) $this->app->make(HandleInertiaRequests::class)
                ->version(Request::create($uri)),
            'X-Inertia-Partial-Component' => 'web/TerminalWindow',
            'X-Inertia-Partial-Data' => 'page',
        ])
            ->assertOk()
            ->assertJsonPath('props.page.data', ['agentId' => $agentId]);
    }

    public function test_the_owner_opens_and_renews_an_interest(): void
    {
        $runtime = $this->runtimeOn('host-1');
        $agentId = $runtime->session->agent_id;

        $this->open($agentId, ['intervalMs' => 1000])->assertOk()->assertJsonPath('intervalMs', 1000);
        $view = TerminalView::query()->acrossActors()->live()->sole();

        $this->actingAs($this->owner)
            ->postJson("/web/agents/{$agentId}/terminal/interests/renew", ['interest' => $view->read_interest_id])
            ->assertOk()
            ->assertJsonPath('readInterestId', $view->read_interest_id);
        $this->assertSame($view->id, TerminalView::query()->acrossActors()->live()->sole()->id);
    }

    public function test_each_refusal_answers_its_code(): void
    {
        $process = $this->runtimeOn('host-1', DriverType::Headless);
        $stopped = $this->runtimeOn('host-1');
        $this->app->make(DriverRequestEndings::class)->closeAfterExit($stopped);

        $this->assertRefusal($process->session->agent_id, TerminalViewRefusal::ProcessDriver);
        $this->assertRefusal($stopped->session->agent_id, TerminalViewRefusal::NotRunning);
        $this->assertRefusal('01jzzzzzzzzzzzzzzzzzzzzzzz', TerminalViewRefusal::MayNotInspect);

        $stranger = User::factory()->create();
        $this->actingAs($stranger)
            ->postJson("/web/agents/{$process->session->agent_id}/terminal/interests", ['requestId' => 'x'])
            ->assertForbidden();
        $this->assertSame(0, TerminalView::query()->acrossActors()->count());
    }

    public function test_too_many_views_are_refused(): void
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

        $this->assertRefusal($runtime->session->agent_id, TerminalViewRefusal::TooManyViews);
    }

    public function test_a_stored_frame_is_served_once_and_then_answered_unchanged(): void
    {
        $runtime = $this->runtimeOn('host-1');
        $agentId = $runtime->session->agent_id;
        $this->open($agentId)->assertOk();

        $this->frame($agentId)->assertExactJson(['state' => TerminalFrameState::Unchanged->value]);
        $this->storeFrame($runtime, 'epoch-1', 3);

        $this->frame($agentId)
            ->assertJsonPath('state', TerminalFrameState::Live->value)
            ->assertJsonPath('frame.epoch', 'epoch-1')
            ->assertJsonPath('frame.sequence', 3)
            ->assertJsonPath('frame.rows.0.runs.0.text', '<script>');
        $this->frame($agentId, ['epoch' => 'epoch-1', 'stream' => 'stream-1', 'after' => 3])
            ->assertJsonPath('state', TerminalFrameState::Unchanged->value)
            ->assertJsonMissingPath('frame');
        $this->frame($agentId, ['epoch' => 'epoch-0', 'after' => 9])->assertJsonPath('frame.sequence', 3);
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
        $held = new HeldFrame($view->read_interest_id, '', '', 0);

        $this->assertThrows(fn () => $frames->after($agentId, $held), ActorNotAllowed::class);
        $this->assertTrue($view->refresh()->isLive());
    }

    public function test_a_stopped_runtime_says_ended_with_its_last_frame(): void
    {
        $runtime = $this->runtimeOn('host-1');
        $agentId = $runtime->session->agent_id;
        $this->open($agentId)->assertOk();
        $this->storeFrame($runtime, 'epoch-1', 1);
        $this->app->make(DriverRequestEndings::class)->closeAfterExit($runtime);

        $this->frame($agentId, ['epoch' => 'epoch-1', 'stream' => 'stream-1', 'after' => 1])
            ->assertJsonPath('state', TerminalFrameState::Ended->value)
            ->assertJsonPath('frame.sequence', 1)
            ->assertJsonStructure(['endedAt']);
    }

    public function test_a_new_generation_answers_restarted_and_a_fresh_open_shows_its_frames(): void
    {
        $runtime = $this->runtimeOn('host-1');
        $agentId = $runtime->session->agent_id;
        $this->open($agentId)->assertOk();
        $runtime->reassignTo('host-2', 'start-token-2');
        $this->storeFrame($runtime, 'epoch-2', 1);

        $this->frame($agentId)->assertExactJson(['state' => TerminalFrameState::Restarted->value]);
        $this->assertSame(0, TerminalView::query()->acrossActors()->live()->count());

        $this->open($agentId)->assertOk();
        $this->frame($agentId)
            ->assertJsonPath('state', TerminalFrameState::Live->value)
            ->assertJsonPath('frame.epoch', 'epoch-2');
        $view = TerminalView::query()->acrossActors()->live()->sole();
        $this->assertSame($runtime->process_generation, $view->process_generation);
    }

    public function test_a_view_of_a_session_the_agent_left_ends_instead_of_following_the_replacement(): void
    {
        $old = $this->runtimeOn('host-1');
        $agent = Agent::query()->findOrFail($old->session->agent_id);
        $this->open($agent->id)->assertOk();
        $this->app->make(AgentSessions::class)->end($old->session);
        $agent->fenceRuntimes();
        $replacement = $this->app->make(StartSessions::class)
            ->start($agent, TestSelections::of('claude-code'), TestSelections::requestId());
        $intent = new RuntimeIntent(
            'host-1',
            base_path(),
            'claude-code',
            '1.0.0',
            'default',
            DriverType::Terminal,
            null,
            null,
            null,
        );
        $this->app->make(AgentRuntimes::class)->open($replacement->session, $intent, 'start-token-2');

        $this->frame($agent->id)->assertJsonPath('state', TerminalFrameState::Ended->value);
        $this->assertSame(0, TerminalView::query()->acrossActors()->live()->count());
    }

    private function assertRefusal(string $agentId, TerminalViewRefusal $refusal): void
    {
        $before = TerminalView::query()->acrossActors()->count();

        $this->open($agentId)
            ->assertStatus($refusal->code()->status())
            ->assertJsonPath('code', $refusal->code()->value);

        $this->assertSame($before, TerminalView::query()->acrossActors()->count());
    }

    /**
     * @param  array<string, int>  $body
     */
    private function open(string $agentId, array $body = []): TestResponse
    {
        $response = $this->actingAs($this->owner)
            ->postJson("/web/agents/{$agentId}/terminal/interests", [...$body, 'requestId' => (string) Str::ulid()]);
        $this->readInterestId = (string) $response->json('readInterestId');

        return $response;
    }

    /**
     * The JSON frame read of the interest the last open opened, after the frame the viewer holds.
     *
     * @param  array<string, string|int>  $held
     */
    private function frame(string $agentId, array $held = []): TestResponse
    {
        $query = http_build_query([...$held, 'interest' => $this->readInterestId]);

        return $this->actingAs($this->owner)->getJson("/web/agents/{$agentId}/terminal/frame?{$query}")->assertOk();
    }

    private function storeFrame(AgentRuntime $runtime, string $epoch, int $sequence): void
    {
        $frame = ScreenFrameData::from([
            'epoch' => $epoch,
            'sequence' => $sequence,
            'captured' => '2026-11-19T12:00:00Z',
            'columns' => 20,
            'rows' => [[['text' => '<script>']]],
            'cursor' => ['row' => 0, 'column' => 8, 'isVisible' => true],
            'buffer' => 'normal',
            'isPlain' => false,
            'is_too_large' => false,
            'isUnreadable' => false,
            'has_no_terminal' => false,
            'stream' => 'stream-1',
            'expires_at' => CarbonImmutable::now()->addSeconds(15)->toIso8601ZuluString(),
        ]);

        $this->app->make(RuntimeScreen::class)
            ->admit(ScreenRegistration::of($runtime->refresh()), $frame, CarbonImmutable::now());
    }

    private function viewerOf(User $user): ActorIdentity
    {
        return ActorIdentity::of(ActorContext::forUser($user->id));
    }
}
