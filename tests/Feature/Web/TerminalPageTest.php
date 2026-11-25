<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use App\Data\Terminals\ScreenFrameData;
use App\Enums\Drivers\DriverType;
use App\Enums\Terminals\TerminalFrameStatus;
use App\Enums\Terminals\TerminalViewRefusal;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\TerminalView;
use App\Support\Access\AccessSettings;
use App\Support\AgentRuntimes;
use App\Support\AgentSessions;
use App\Support\DriverRequestEndings;
use App\Support\RuntimeScreen;
use App\Support\ScreenRegistration;
use App\Support\StartSessions;
use App\Values\RuntimeIntent;
use Carbon\CarbonImmutable;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\OpensTerminalRuntimes;
use Tests\Support\RefreshHookDatabase;
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

    private User $owner;

    private string $readInterestId = '';

    protected function setUp(): void
    {
        parent::setUp();
        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
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

    public function test_a_stored_frame_is_served_once_and_then_answered_unchanged(): void
    {
        $runtime = $this->runtimeOn('host-1');
        $agentId = $runtime->session->agent_id;
        $this->open($agentId)->assertOk();

        $this->frame($agentId)->assertExactJson(['state' => TerminalFrameStatus::Unchanged->value]);
        $this->storeFrame($runtime, 'epoch-1', 3);

        $this->frame($agentId)
            ->assertJsonPath('state', TerminalFrameStatus::Live->value)
            ->assertJsonPath('frame.epoch', 'epoch-1')
            ->assertJsonPath('frame.sequence', 3)
            ->assertJsonPath('frame.rows.0.runs.0.text', '<script>');
        $this->frame($agentId, ['epoch' => 'epoch-1', 'stream' => 'stream-1', 'after' => 3])
            ->assertJsonPath('state', TerminalFrameStatus::Unchanged->value)
            ->assertJsonMissingPath('frame');
        $this->frame($agentId, ['epoch' => 'epoch-0', 'after' => 9])->assertJsonPath('frame.sequence', 3);
    }

    public function test_a_stopped_runtime_says_ended_with_its_last_frame(): void
    {
        $runtime = $this->runtimeOn('host-1');
        $agentId = $runtime->session->agent_id;
        $this->open($agentId)->assertOk();
        $this->storeFrame($runtime, 'epoch-1', 1);
        $this->app->make(DriverRequestEndings::class)->closeAfterExit($runtime);

        $this->frame($agentId, ['epoch' => 'epoch-1', 'stream' => 'stream-1', 'after' => 1])
            ->assertJsonPath('state', TerminalFrameStatus::Ended->value)
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

        $this->frame($agentId)->assertExactJson(['state' => TerminalFrameStatus::Restarted->value]);
        $this->assertSame(0, TerminalView::query()->acrossActors()->live()->count());

        $this->open($agentId)->assertOk();
        $this->frame($agentId)
            ->assertJsonPath('state', TerminalFrameStatus::Live->value)
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

        $this->frame($agent->id)->assertJsonPath('state', TerminalFrameStatus::Ended->value);
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
}
