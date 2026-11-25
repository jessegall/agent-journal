<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Contracts\Actors\ActorAttention;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Assignments\AssignmentTransaction;
use App\Contracts\Chat\MainSeatTakeover;
use App\Enums\Drivers\HoldReason;
use App\Enums\Navigation\MenuEntryState;
use App\Enums\Navigation\NavigationCompletion;
use App\Enums\Navigation\NavigationReason;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\DriverRequest;
use App\Models\Drivers\MenuEntry;
use App\Models\Drivers\NavigationRequest;
use App\Support\Access\AccessSettings;
use App\Support\ActorContext;
use App\Support\ActorIdentity;
use App\Support\EnrolledHost;
use App\Support\NavigationLibrary;
use App\Support\OpenedRuntime;
use App\Values\MenuStep;
use App\Values\NavigationScreen;
use App\Values\NavigationUncertainty;
use App\Values\OwnerAuthority;
use Carbon\CarbonImmutable;
use Illuminate\Testing\TestResponse;
use Tests\Fixtures\Agents\RecordedAttention;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\CommitsHookRows;
use Tests\Support\InstallsDesks;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\SendsHostCalls;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * The host's one call at an uncertain point: it opens one navigation request, holds the runtime and wakes the main
 * desk's occupant; a repeated raise answers the same; a runtime raising the same menu waits; the main agent's own
 * runtime stays held for the user; another host is refused.
 */
final class NavigationRaiseRouteTest extends TestCase
{
    use CommitsHookRows;
    use InstallsDesks;
    use OpensLedgerRuntimes;
    use RunsTrustedCommands;
    use SendsHostCalls;

    private const string STALE_REASON = 'label-missing at step 1';

    private const array TABLES = [
        'users',
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'hook_calls',
        'hosts',
        'agent_runtimes',
        'driver_requests',
        'navigation_requests',
        'menu_entries',
        'inboxes',
        'assignments',
        'accounts',
        'active_accounts',
        'session_processes',
    ];

    private const string FINGERPRINT = 'fp1:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

    private RecordedAttention $attention;

    protected function setUp(): void
    {
        parent::setUp();
        $this->app->instance(AccessSettings::class, new AccessSettings('owner'));
        $this->attention = new RecordedAttention();
        $this->app->bind(ActorAttention::class, fn () => $this->attention);
    }

    public function test_a_raise_opens_one_request_holds_the_runtime_and_wakes_once_when_sent_twice(): void
    {
        $this->seat(Agent::create('Main', 'main-agent'));
        [$host, $opened, $request] = $this->stalledScript();

        $first = $this->raise($host, $opened, $request)->assertOk();
        $second = $this->raise($host, $opened, $request)->assertOk();

        $this->assertSame('opened', $first->json('answer'));
        $this->assertSame($first->json('requestId'), $second->json('requestId'));
        $this->assertSame(1, NavigationRequest::query()->acrossActors()->count());
        $navigation = NavigationRequest::query()->acrossActors()->sole();
        $this->assertSame(['Model: GPT-5', '❯ GPT-6'], $navigation->raise_rows);
        $runtime = AgentRuntime::query()->findOrFail($opened->runtimeId);
        $this->assertSame(HoldReason::NavigationNeeded, $runtime->hold_reason);
        $this->assertSame(2, $request->fresh()?->script_step);
        $this->assertCount(1, $this->attention->wakes);
    }

    public function test_a_second_runtime_raising_the_same_menu_waits_and_opens_nothing(): void
    {
        $this->seat(Agent::create('Main', 'main-agent'));
        [$host, $opened, $request] = $this->stalledScript();
        [$otherHost, $other, $otherRequest] = $this->stalledScript();
        $this->raise($host, $opened, $request)->assertOk();

        $waiting = $this->raise($otherHost, $other, $otherRequest)->assertOk();

        $this->assertSame(['wait', 30], [$waiting->json('answer'), $waiting->json('retryAfterSeconds')]);
        $this->assertSame(1, NavigationRequest::query()->acrossActors()->count());
    }

    #[TimeLimit(seconds: 30, reason: 'It opens fifty runtimes with different goals before the matching raise.')]
    public function test_an_exact_open_goal_is_found_behind_fifty_different_goals(): void
    {
        $this->seat(Agent::create('Main', 'main-agent'));
        [, , $matching] = $this->stalledScript();
        $this->navigationFor($matching);
        $this->travel(1)->seconds();

        for ($number = 1; $number <= 50; $number++) {
            [, , $different] = $this->stalledScript("Model {$number}");
            $this->navigationFor($different);
        }

        [$host, $opened, $request] = $this->stalledScript();

        $answer = $this->raise($host, $opened, $request)->assertOk();

        $this->assertSame('wait', $answer->json('answer'));
        $this->assertSame(51, NavigationRequest::query()->acrossActors()->count());
    }

    public function test_the_main_agents_own_runtime_is_held_for_the_user(): void
    {
        [$host, $opened, $request] = $this->stalledScript();
        $this->seat(Agent::query()->findOrFail($this->agentIdOf($opened)));

        $held = $this->raise($host, $opened, $request)->assertOk();

        $this->assertSame('held', $held->json('answer'));
        $this->assertSame(0, NavigationRequest::query()->acrossActors()->count());
    }

    public function test_a_raise_for_another_hosts_runtime_or_with_an_oversized_screen_is_refused(): void
    {
        $this->seat(Agent::create('Main', 'main-agent'));
        [$host, $opened, $request] = $this->stalledScript();
        [$otherHost] = $this->stalledScript();

        $this->assertGreaterThanOrEqual(400, $this->raise($otherHost, $opened, $request)->status());
        $tooLong = $this->raise($host, $opened, $request, array_fill(0, 61, 'row'));
        $this->assertGreaterThanOrEqual(400, $tooLong->status());
        $this->assertSame(0, NavigationRequest::query()->acrossActors()->count());
    }

    public function test_an_entry_current_on_the_build_is_answered_and_opens_nothing(): void
    {
        $this->seat(Agent::create('Main', 'main-agent'));
        $entry = $this->libraryEntry('2.1.323');
        [$host, $opened, $request] = $this->stalledScript();
        $before = NavigationRequest::query()->acrossActors()->count();
        $wakes = count($this->attention->wakes);

        $answer = $this->raise($host, $opened, $request)->assertOk();

        $this->assertSame(['entry', false, $entry->id], [
            $answer->json('answer'),
            $answer->json('guarded'),
            $answer->json('entry.id'),
        ]);
        $this->assertSame('GPT-6', $answer->json('entry.steps.0.choose'));
        $this->assertSame($before, NavigationRequest::query()->acrossActors()->count());
        $this->assertCount($wakes, $this->attention->wakes);
    }

    public function test_an_entry_proven_on_another_build_only_is_answered_guarded(): void
    {
        $this->seat(Agent::create('Main', 'main-agent'));
        $entry = $this->libraryEntry('2.1.300');
        [$host, $opened, $request] = $this->stalledScript();

        $answer = $this->raise($host, $opened, $request)->assertOk();

        $this->assertSame(['entry', true, $entry->id], [
            $answer->json('answer'),
            $answer->json('guarded'),
            $answer->json('entry.id'),
        ]);
    }

    public function test_build_proof_wins_over_twenty_newer_guarded_entries(): void
    {
        $this->seat(Agent::create('Main', 'main-agent'));
        $entry = $this->libraryEntry('2.1.323');
        $this->travel(1)->seconds();
        $this->addPaths($this->librarySource('2.1.300'));
        [$host, $opened, $request] = $this->stalledScript();

        $answer = $this->raise($host, $opened, $request)->assertOk();

        $this->assertSame($entry->id, $answer->json('entry.id'));
        $this->assertFalse($answer->json('guarded'));
    }

    public function test_a_guarded_entry_is_found_behind_twenty_newer_stale_entries(): void
    {
        $this->seat(Agent::create('Main', 'main-agent'));
        $entry = $this->libraryEntry('2.1.300');
        $this->travel(1)->seconds();
        $this->addPaths($this->librarySource('2.1.323'), ['2.1.323']);
        [$host, $opened, $request] = $this->stalledScript();

        $answer = $this->raise($host, $opened, $request)->assertOk();

        $this->assertSame($entry->id, $answer->json('entry.id'));
        $this->assertTrue($answer->json('guarded'));
    }

    public function test_saving_reuses_the_exact_path_behind_twenty_newer_paths(): void
    {
        $entry = $this->libraryEntry('2.1.300');
        $this->travel(1)->seconds();
        $navigation = $this->librarySource('2.1.323');
        $this->addPaths($navigation);

        $saved = $this->app->make(AssignmentTransaction::class)->run(
            fn () => $this->app->make(NavigationLibrary::class)->save($navigation, $entry->steps->items()),
        );

        $this->assertSame($entry->id, $saved->id);
        $this->assertSame(false, $saved->buildOn('2.1.323')?->isStale);
        $this->assertSame(21, MenuEntry::query()->acrossActors()->count());
    }

    public function test_a_stale_or_retired_entry_is_not_answered(): void
    {
        $this->seat(Agent::create('Main', 'main-agent'));
        $this->libraryEntry('2.1.323')->markStaleOn('2.1.323', 'label-missing', []);
        $this->libraryEntry('2.1.323')->retire();
        [$host, $opened, $request] = $this->stalledScript();

        $this->assertSame('opened', $this->raise($host, $opened, $request)->assertOk()->json('answer'));
    }

    public function test_an_entry_the_host_declined_is_not_answered_again(): void
    {
        $this->seat(Agent::create('Main', 'main-agent'));
        $entry = $this->libraryEntry('2.1.323');
        [$host, $opened, $request] = $this->stalledScript();

        $answer = $this->raise($host, $opened, $request, declined: [$entry->id])->assertOk();

        $this->assertSame('opened', $answer->json('answer'));
    }

    public function test_a_stale_report_marks_one_build_only_and_a_repeat_changes_nothing(): void
    {
        $entry = $this->libraryEntry('2.1.323');
        $entry->provenOn('2.1.400');
        [$host, $opened] = $this->openRuntime();
        $report = fn (string $reason) => $this->hostCall($host, "/host/menu-entries/{$entry->id}/stale", [
            'runtime_id' => $opened->runtimeId,
            'operation_key' => 'stale-1',
            'reason' => $reason,
            'step' => 1,
            'build' => '2.1.323',
            'rows' => ['Model: <redacted>'],
        ]);

        $report('label-missing')->assertNoContent();
        $report('no-proof')->assertNoContent();

        $entry = MenuEntry::query()->acrossActors()->findOrFail($entry->id);
        $this->assertSame(true, $entry->buildOn('2.1.323')?->isStale);
        $this->assertSame(false, $entry->buildOn('2.1.400')?->isStale);
        $this->assertSame(self::STALE_REASON, $entry->buildOn('2.1.323')?->staleReason);
        $this->assertSame(['Model: <redacted>'], $entry->buildOn('2.1.323')?->staleScreen);
    }

    public function test_a_stale_entry_raise_keeps_its_hint_and_the_proven_path_supersedes_it(): void
    {
        $this->seat(Agent::create('Main', 'main-agent'));
        $stale = $this->libraryEntry('2.1.323');
        $stale->markStaleOn('2.1.323', 'label-missing at step 1', []);
        [$host, $opened, $request] = $this->stalledScript();

        $answer = $this->raise($host, $opened, $request, stale: [
            'stale_entry' => $stale->id,
            'sent_steps' => ['choose GPT-6'],
        ])->assertOk();

        $navigation = NavigationRequest::query()->acrossActors()->findOrFail($answer->json('requestId'));
        $this->assertSame([$stale->id, ['choose GPT-6']], [$navigation->stale_entry_id, $navigation->sent_steps]);
        $navigation->answer();
        $navigation->prove(NavigationCompletion::Goal, null, 'GPT-6');
        $saved = $this->app->make(AssignmentTransaction::class)->run(fn () => $this->app->make(NavigationLibrary::class)
            ->save($navigation, [new MenuStep(self::FINGERPRINT, 'GPT-7', null, null)]));
        $this->assertSame(MenuEntryState::Superseded, $stale->fresh()?->state);
        $this->assertSame(MenuEntryState::Current, $saved->state);
    }

    public function test_the_replayed_report_counts_once_and_lists_the_build(): void
    {
        $entry = $this->libraryEntry('2.1.300');
        [$host, $opened] = $this->openRuntime();
        $replayed = ['runtime_id' => $opened->runtimeId, 'operation_key' => 'replay-1'];

        $this->hostCall($host, "/host/menu-entries/{$entry->id}/replayed", $replayed)->assertNoContent();
        $this->hostCall($host, "/host/menu-entries/{$entry->id}/replayed", $replayed)->assertNoContent();

        $entry = MenuEntry::query()->acrossActors()->findOrFail($entry->id);
        $this->assertSame(1, $entry->uses);
        $this->assertSame(false, $entry->buildOn('2.1.323')?->isStale);
    }

    /**
     * An entry of the owner's library, proven on the build, that chooses GPT-6 on the picker the raises show.
     */
    private function libraryEntry(string $build): MenuEntry
    {
        $source = $this->librarySource($build);
        $steps = [new MenuStep(self::FINGERPRINT, 'GPT-6', null, null)];

        return MenuEntry::create($source->actor(), $source, $steps, NavigationCompletion::Goal, 'GPT-6');
    }

    private function librarySource(string $build): NavigationRequest
    {
        [, $opened] = $this->openRuntime(build: $build);
        $receipt = $this->asOwner($this->keyScript($opened, 'ChangeModel', ['model' => 'GPT-6']));
        $request = DriverRequest::query()->with('runtime')->findOrFail($receipt->requestId);
        $source = $this->navigationFor($request);
        $source->cancel();

        return $source;
    }

    private function navigationFor(DriverRequest $request): NavigationRequest
    {
        $screen = new NavigationScreen(['Model: GPT-5', '❯ GPT-6'], 1, 7);
        $uncertainty = new NavigationUncertainty(NavigationReason::LabelMissing, 2, self::FINGERPRINT, $screen);
        $owner = ActorIdentity::ofClass(User::class, 'owner');

        return NavigationRequest::create($request, $owner, $uncertainty, 'source', CarbonImmutable::now());
    }

    /**
     * @param  list<string>  $staleBuilds
     */
    private function addPaths(NavigationRequest $source, array $staleBuilds = []): void
    {
        for ($number = 1; $number <= 20; $number++) {
            $steps = [new MenuStep(self::FINGERPRINT, "Path {$number}", null, null)];
            $entry = MenuEntry::create($source->actor(), $source, $steps, NavigationCompletion::Goal, 'GPT-6');

            foreach ($staleBuilds as $build) {
                $entry->markStaleOn($build, 'label-missing', []);
            }
        }
    }

    /**
     * A ChangeModel key script on a newly opened runtime of its own host, as the host claimed it.
     *
     * @return array{EnrolledHost, OpenedRuntime, DriverRequest}
     */
    private function stalledScript(string $model = 'GPT-6'): array
    {
        [$host, $opened] = $this->openRuntime();
        $receipt = $this->asOwner($this->keyScript($opened, 'ChangeModel', ['model' => $model]));

        return [$host, $opened, DriverRequest::query()->with('runtime')->findOrFail($receipt->requestId)];
    }

    /**
     * The host's raise of the request stalled at its step 2 on the model picker.
     *
     * @param  list<string>  $rows
     * @param  list<string>  $declined
     * @param  array<string, mixed>  $stale  the stale entry and the steps its replay already sent
     */
    private function raise(
        EnrolledHost $host,
        OpenedRuntime $opened,
        DriverRequest $request,
        array $rows = ['Model: GPT-5', '❯ GPT-6'],
        array $declined = [],
        array $stale = [],
    ): TestResponse {
        return $this->hostCall($host, "/host/runtimes/{$opened->runtimeId}/navigation", [
            'operation_key' => "{$request->id}:{$request->attempt_version}:2",
            'request_id' => $request->id,
            'attempt' => $request->attempt_version,
            'step' => 2,
            'reason' => 'label-missing',
            'fingerprint' => self::FINGERPRINT,
            'rows' => $rows,
            'highlight' => 1,
            'generation' => 7,
            ...($declined === [] ? [] : ['declined_entries' => $declined]),
            ...$stale,
        ]);
    }

    private function seat(Agent $agent): void
    {
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser('owner'), new OwnerAuthority('test'));
        $this->app->make(AssignmentTransaction::class)->run(
            fn () => $this->app->make(MainSeatTakeover::class)->takeOver($agent),
        );
    }
}
