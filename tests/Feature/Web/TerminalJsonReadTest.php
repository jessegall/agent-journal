<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use App\Contracts\Time\ServerClock;
use App\Data\Terminals\ScreenFrameData;
use App\Enums\Engine\RefusalCode;
use App\Enums\Terminals\TerminalFrameState;
use App\Models\Access\User;
use App\Models\Agents\AgentRuntime;
use App\Support\Access\AccessSettings;
use App\Support\RuntimeScreen;
use App\Support\ScreenRegistration;
use Carbon\CarbonImmutable;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Tests\Support\FakeServerClock;
use Tests\Support\OpensTerminalRuntimes;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The terminal's JSON actions, outside any page's props: a view opens its own read interest, reads live frames whose
 * liveness proof counts down by the server's clock, sees nothing of a screen kept for another identity, sees an older
 * host's frame only as last reported, and a viewer without inspect is refused.
 */
final class TerminalJsonReadTest extends TestCase
{
    use OpensTerminalRuntimes;
    use RefreshHookDatabase;

    private User $owner;

    private FakeServerClock $clock;

    protected function setUp(): void
    {
        parent::setUp();
        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $this->clock = new FakeServerClock(CarbonImmutable::parse('2026-11-19 12:00:00'));
        $this->app->instance(ServerClock::class, $this->clock);
    }

    public function test_a_live_frame_carries_its_identity_and_a_remaining_lifetime_that_only_counts_down(): void
    {
        $runtime = $this->runtimeOn('host-1');
        $agentId = $runtime->session->agent_id;
        $interest = $this->openInterest($agentId);
        $this->store($runtime, 1, ['stream' => 'stream-1', 'expires_at' => '2026-11-19T12:00:15Z']);

        $live = $this->read($agentId, ['interest' => $interest]);
        $this->clock->set(CarbonImmutable::parse('2026-11-19 12:00:04'));
        $held = ['interest' => $interest, 'epoch' => 'epoch-1', 'stream' => 'stream-1', 'after' => 1];
        $repeated = $this->read($agentId, $held);

        $live->assertOk()
            ->assertJsonPath('state', TerminalFrameState::Live->value)
            ->assertJsonPath('identity.sessionId', $runtime->agent_session_id)
            ->assertJsonPath('identity.processGeneration', $runtime->process_generation)
            ->assertJsonPath('identity.stream', 'stream-1')
            ->assertJsonPath('identity.privacyRevision', 0)
            ->assertJsonPath('liveForMs', 15_000)
            ->assertJsonPath('frame.rows.0.runs.0.text', 'hello');
        $repeated->assertOk()
            ->assertJsonPath('state', TerminalFrameState::Unchanged->value)
            ->assertJsonPath('liveForMs', 11_000)
            ->assertJsonMissingPath('frame');
        $this->assertTrue($live->headers->hasCacheControlDirective('no-store'));
    }

    public function test_a_frame_kept_for_an_earlier_generation_shows_nothing_to_a_fresh_interest(): void
    {
        $runtime = $this->runtimeOn('host-1');
        $agentId = $runtime->session->agent_id;
        $this->store($runtime, 1, ['stream' => 'stream-1', 'expires_at' => '2026-11-19T12:00:15Z']);
        $runtime->reassignTo('host-2', 'start-token-2');
        $interest = $this->openInterest($agentId);

        $this->read($agentId, ['interest' => $interest])
            ->assertOk()
            ->assertJsonPath('state', TerminalFrameState::Unchanged->value)
            ->assertJsonMissingPath('frame')
            ->assertJsonMissingPath('identity');
    }

    public function test_an_older_hosts_frame_is_last_reported_with_no_live_claim(): void
    {
        $runtime = $this->runtimeOn('host-1');
        $agentId = $runtime->session->agent_id;
        $interest = $this->openInterest($agentId);
        $this->store($runtime, 1, []);

        $this->read($agentId, ['interest' => $interest])
            ->assertOk()
            ->assertJsonPath('state', TerminalFrameState::LastReported->value)
            ->assertJsonPath('frame.rows.0.runs.0.text', 'hello')
            ->assertJsonMissingPath('liveForMs');
    }

    public function test_a_shielded_screen_answers_preview_unavailable_with_no_rows(): void
    {
        $runtime = $this->runtimeOn('host-1');
        $agentId = $runtime->session->agent_id;
        $interest = $this->openInterest($agentId);
        $this->store($runtime, 1, ['stream' => 'stream-1', 'is_shielded' => true, 'privacy_revision' => 1, 'rows' => []]);

        $this->read($agentId, ['interest' => $interest])
            ->assertOk()
            ->assertJsonPath('state', TerminalFrameState::PreviewUnavailable->value)
            ->assertJsonPath('identity.privacyRevision', 1)
            ->assertJsonMissingPath('frame');
    }

    public function test_a_viewer_without_inspect_is_refused(): void
    {
        $runtime = $this->runtimeOn('host-1');
        $agentId = $runtime->session->agent_id;
        $interest = $this->openInterest($agentId);

        $this->actingAs(User::factory()->create())
            ->getJson("/web/agents/{$agentId}/terminal/frame?interest={$interest}")
            ->assertForbidden();
    }

    public function test_closing_one_interest_answers_no_content_and_its_next_read_says_ended(): void
    {
        $runtime = $this->runtimeOn('host-1');
        $agentId = $runtime->session->agent_id;
        $interest = $this->openInterest($agentId);

        $this->actingAs($this->owner)
            ->postJson("/web/agents/{$agentId}/terminal/interests/close", ['interest' => $interest])
            ->assertNoContent();
        $this->actingAs($this->owner)
            ->postJson("/web/agents/{$agentId}/terminal/interests/renew", ['interest' => $interest])
            ->assertStatus(RefusalCode::StateBlocked->status())
            ->assertJsonPath('code', RefusalCode::StateBlocked->value);

        $this->read($agentId, ['interest' => $interest])->assertJsonPath('state', TerminalFrameState::Ended->value);
    }

    private function openInterest(string $agentId): string
    {
        return (string) $this->actingAs($this->owner)
            ->postJson("/web/agents/{$agentId}/terminal/interests", ['requestId' => (string) Str::ulid()])
            ->assertOk()
            ->assertJsonPath('isLive', true)
            ->json('readInterestId');
    }

    /**
     * @param  array<string, string|int>  $query
     */
    private function read(string $agentId, array $query): TestResponse
    {
        return $this->actingAs($this->owner)
            ->getJson("/web/agents/{$agentId}/terminal/frame?".http_build_query($query));
    }

    /**
     * @param  array<string, mixed>  $fields  the frame fields that differ from an older host's public frame
     */
    private function store(AgentRuntime $runtime, int $sequence, array $fields): void
    {
        $frame = ScreenFrameData::from([
            'epoch' => 'epoch-1',
            'sequence' => $sequence,
            'captured' => '2026-11-19T12:00:00Z',
            'columns' => 20,
            'rows' => [[['text' => 'hello']]],
            'cursor' => ['row' => 0, 'column' => 5, 'isVisible' => true],
            'buffer' => 'normal',
            'isPlain' => false,
            'is_too_large' => false,
            'isUnreadable' => false,
            'has_no_terminal' => false,
            ...$fields,
        ]);

        $this->app->make(RuntimeScreen::class)
            ->admit(ScreenRegistration::of($runtime->refresh()), $frame, $this->clock->now());
    }
}
