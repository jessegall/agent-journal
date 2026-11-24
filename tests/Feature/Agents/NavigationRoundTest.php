<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Contracts\Actors\ActorAttention;
use App\Contracts\Assignments\AssignmentTransaction;
use App\Enums\HoldReason;
use App\Enums\NavigationCompletion;
use App\Enums\NavigationKey;
use App\Enums\NavigationState;
use App\Enums\RequestProgress;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\DriverRequest;
use App\Models\Drivers\MenuEntry;
use App\Models\Drivers\NavigationRequest;
use App\Support\DriverRequestEndings;
use App\Support\EnrolledHost;
use App\Support\NavigationRounds;
use App\Values\MenuStep;
use App\Values\NavigationRound;
use Illuminate\Testing\TestResponse;
use Tests\Fixtures\Agents\RecordedAttention;
use Tests\Support\Agents\RaisesNavigationRequests;
use Tests\Support\CommitsHookRows;
use Tests\Support\InstallsDesks;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\SendsHostCalls;
use Tests\TestCase;

/**
 * A round of the main agent is a Navigate driver request of the stalled runtime: claimed with its round, reported with
 * the screen after it, and a proof the host saw settles the stalled key script; rounds die with their request.
 */
final class NavigationRoundTest extends TestCase
{
    use CommitsHookRows;
    use InstallsDesks;
    use RaisesNavigationRequests;
    use RunsTrustedCommands;
    use SendsHostCalls;

    private const string SAVED_EVIDENCE = 'proven, saved as menu entry %s';

    private const array TABLES = [
        'agents',
        'agent_sessions',
        'start_tokens',
        'agent_stacks',
        'hook_calls',
        'hosts',
        'agent_runtimes',
        'driver_requests',
        'navigation_requests',
        'menu_entries',
        'inboxes',
        'desks',
        'desk_seats',
        'desk_preferences',
        'assignments',
        'accounts',
        'active_accounts',
        'process_starts',
    ];

    protected function setUp(): void
    {
        parent::setUp();
        $attention = new RecordedAttention();
        $this->app->bind(ActorAttention::class, fn () => $attention);
    }

    public function test_a_round_is_appended_once_and_claimed_with_its_keys(): void
    {
        [$host, $navigation] = $this->stalled();
        $round = NavigationRound::keys($navigation->id, $navigation->row_version, 7, [NavigationKey::Down]);

        $first = $this->append($navigation, $round);
        $again = $this->append($navigation, $round);

        $this->assertSame($first->id, $again->id);
        $claimed = collect(
            $this->hostCall($host, '/host/claim?limit=10&wait=0&watched_version=0')->assertOk()->json('requests'),
        )
            ->firstWhere('requestId', $first->id);
        $this->assertSame(['navigate', $navigation->id, ['down']], [
            $claimed['operation'],
            $claimed['navigationRequestId'],
            $claimed['navigationRound']['keys'],
        ]);
    }

    public function test_the_screen_after_a_round_becomes_the_current_screen(): void
    {
        [$host, $navigation] = $this->stalled();
        $round = $this->append($navigation, NavigationRound::choose($navigation->id, 1, 7, 'GPT-6'));

        $this->notify($host, $round, isProofSeen: false)->assertNoContent();

        $this->assertSame(['Model: GPT-6'], $navigation->fresh()?->screen->rows);
    }

    public function test_a_proof_seen_for_the_goal_finishes_the_key_script_and_releases_the_runtime(): void
    {
        [$host, $navigation] = $this->stalled();
        $navigation->answer();
        $navigation->prove(NavigationCompletion::Goal, null, 'GPT-6');
        $round = $this->append($navigation, $this->proofRound($navigation, NavigationCompletion::Goal, null));

        $this->notify($host, $round, isProofSeen: true)->assertNoContent();

        $this->assertSame(NavigationState::Proven, $navigation->fresh()?->state);
        $stalled = DriverRequest::query()->findOrFail($navigation->driver_request_id);
        $this->assertSame(RequestProgress::Applied, $stalled->progress);
        $runtime = AgentRuntime::query()->findOrFail($navigation->agent_runtime_id);
        $this->assertSame(HoldReason::None, $runtime->hold_reason);
    }

    public function test_a_proof_seen_for_a_step_resumes_the_key_script_at_its_next_step(): void
    {
        [$host, $navigation] = $this->stalled();
        $attempt = DriverRequest::query()->findOrFail($navigation->driver_request_id)->attempt_version;
        $navigation->answer();
        $navigation->prove(NavigationCompletion::Step, 4, 'GPT-6');
        $round = $this->append($navigation, $this->proofRound($navigation, NavigationCompletion::Step, 4));

        $this->notify($host, $round, isProofSeen: true)->assertNoContent();

        $stalled = DriverRequest::query()->findOrFail($navigation->driver_request_id);
        $this->assertSame([4, $attempt + 1, RequestProgress::Accepted], [
            $stalled->script_step,
            $stalled->attempt_version,
            $stalled->progress,
        ]);
    }

    public function test_a_proof_not_seen_sends_the_main_agent_back_to_answering(): void
    {
        [$host, $navigation] = $this->stalled();
        $navigation->answer();
        $navigation->prove(NavigationCompletion::Goal, null, 'GPT-6');
        $round = $this->append($navigation, $this->proofRound($navigation, NavigationCompletion::Goal, null));

        $this->notify($host, $round, isProofSeen: false)->assertNoContent();

        $this->assertSame(NavigationState::Answering, $navigation->fresh()?->state);
    }

    public function test_an_ended_request_cancels_its_queued_rounds_and_refuses_their_report(): void
    {
        [$host, $navigation] = $this->stalled();
        $reported = $this->append($navigation, NavigationRound::keys($navigation->id, 2, 7, [NavigationKey::Esc]));
        $this->hostCall($host, '/host/claim?limit=10&wait=0&watched_version=0')->assertOk();
        $queued = $this->append($navigation, NavigationRound::keys($navigation->id, 3, 7, [NavigationKey::Esc]));

        $this->app->make(DriverRequestEndings::class)->cancelNavigation($navigation);

        $this->assertSame(RequestProgress::Cancelled, $queued->fresh()?->progress);
        $this->assertGreaterThanOrEqual(400, $this->notify($host, $reported, isProofSeen: false)->status());
    }

    public function test_a_proven_path_is_saved_once_as_a_menu_entry_and_named_in_the_evidence(): void
    {
        [$host, $navigation] = $this->stalled();
        $round = $this->proved($navigation);

        $this->notify($host, $round, isProofSeen: true, steps: [$this->step()])->assertNoContent();

        $entry = MenuEntry::query()->acrossActors()->sole();
        $this->assertSame($entry->id, $navigation->fresh()?->library_entry_id);
        $this->assertSame(
            [[...$this->step(), 'key' => null, 'proof' => null]],
            array_map(fn (MenuStep $step) => $step->toArray(), $entry->steps),
        );
        $stalled = DriverRequest::query()->findOrFail($navigation->driver_request_id);
        $this->assertSame(sprintf(self::SAVED_EVIDENCE, $entry->id), $stalled->script_evidence);

        [$otherHost, $other] = $this->stalled('2.1.400');
        $this->notify($otherHost, $this->proved($other), isProofSeen: true, steps: [$this->step()])->assertNoContent();
        $this->assertSame(1, MenuEntry::query()->acrossActors()->count());
        $this->assertSame(false, MenuEntry::query()->acrossActors()->sole()->buildOn('2.1.400')?->isStale);
    }

    public function test_steps_that_could_carry_screen_text_are_refused_and_save_nothing(): void
    {
        $invalid = [
            'both actions' => [[...$this->step(), 'key' => 'enter']],
            'a free text field' => [[...$this->step(), 'screen' => 'Model: GPT-5']],
            'too many steps' => array_fill(0, 21, $this->step()),
        ];

        foreach ($invalid as $name => $steps) {
            [$host, $navigation] = $this->stalled();
            $response = $this->notify($host, $this->proved($navigation), isProofSeen: true, steps: $steps);

            $this->assertGreaterThanOrEqual(400, $response->status(), $name);
        }

        $this->assertSame(0, MenuEntry::query()->acrossActors()->count());
    }

    /**
     * @return array{fingerprint: string, choose: string}
     */
    private function step(): array
    {
        return ['fingerprint' => 'fp1:'.str_repeat('b', 64), 'choose' => 'GPT-6'];
    }

    /**
     * The navigation answered and proven by the main agent, with its proof round appended.
     */
    private function proved(NavigationRequest $navigation): DriverRequest
    {
        $navigation->answer();
        $navigation->prove(NavigationCompletion::Goal, null, 'GPT-6');

        return $this->append($navigation, $this->proofRound($navigation, NavigationCompletion::Goal, null));
    }

    /**
     * A key script stalled on a newly opened runtime, with its navigation request raised.
     *
     * @return array{EnrolledHost, NavigationRequest}
     */
    private function stalled(string $build = '2.1.323'): array
    {
        [$host, $opened] = $this->openRuntime(build: $build);
        $receipt = $this->asOwner($this->keyScript($opened, 'ChangeModel', ['model' => 'GPT-6']));
        $stalled = DriverRequest::query()->with('runtime')->findOrFail($receipt->requestId);

        return [$host, $this->raise($stalled, 'raise-1')];
    }

    private function proofRound(
        NavigationRequest $navigation,
        NavigationCompletion $completes,
        int|null $nextStep,
    ): NavigationRound {
        return NavigationRound::proof($navigation->id, $navigation->row_version, 7, 'GPT-6', $completes, $nextStep);
    }

    private function append(NavigationRequest $navigation, NavigationRound $round): DriverRequest
    {
        return $this->app->make(AssignmentTransaction::class)->run(
            fn () => $this->app->make(NavigationRounds::class)->append($navigation, $round),
        );
    }

    /**
     * @param  list<array<string, mixed>>  $steps
     */
    private function notify(EnrolledHost $host, DriverRequest $round, bool $isProofSeen, array $steps = []): TestResponse
    {
        return $this->hostCall($host, '/host/reports/request', [
            'request_id' => $round->id,
            'attempt' => $round->fresh()?->attempt_version,
            'progress' => 'applied',
            'actual_binding' => 'navigation',
            'outcome' => null,
            'navigation' => [
                'rows' => ['Model: GPT-6'],
                'highlight' => -1,
                'generation' => 8,
                'has_observed_proof' => $isProofSeen,
                ...($steps === [] ? [] : ['steps' => $steps]),
            ],
        ]);
    }
}
