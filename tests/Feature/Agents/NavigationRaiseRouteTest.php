<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Actors\Contracts\ActorAttention;
use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorContext;
use App\Actors\Support\ActorIdentity;
use App\Actors\Values\OwnerAuthority;
use App\Agents\Contracts\MainSeatTakeover;
use App\Agents\Enums\HoldReason;
use App\Agents\Enums\MenuEntryState;
use App\Agents\Enums\NavigationCompletion;
use App\Agents\Enums\NavigationReason;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentRuntime;
use App\Agents\Models\DriverRequest;
use App\Agents\Models\MenuEntry;
use App\Agents\Models\NavigationRequest;
use App\Agents\Support\EnrolledHost;
use App\Agents\Support\NavigationLibrary;
use App\Agents\Support\OpenedRuntime;
use App\Agents\Values\MenuStep;
use App\Agents\Values\NavigationScreen;
use App\Agents\Values\NavigationUncertainty;
use App\Assignments\Contracts\AssignmentTransaction;
use Carbon\CarbonImmutable;
use Domain\Access\Support\AccessSettings;
use Illuminate\Testing\TestResponse;
use Tests\Fixtures\Agents\RecordedAttention;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\CommitsHookRows;
use Tests\Support\InstallsDesks;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\SendsHostCalls;
use Tests\TestCase;

/**
 * The host's one call at an uncertain point: it opens one navigation request, holds the runtime and wakes the main
 * desk's occupant; a repeated raise answers the same; a runtime raising the same menu waits; the main agent's own
 * runtime stays held for the person; another host is refused.
 */
final class NavigationRaiseRouteTest extends TestCase
{
    use CommitsHookRows;
    use InstallsDesks;
    use OpensLedgerRuntimes;
    use RunsTrustedCommands;
    use SendsHostCalls;

    private const array TABLES = [
        'users',
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
        $this->seat(Agent::named('Main', 'main-agent'));
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
        $this->seat(Agent::named('Main', 'main-agent'));
        [$host, $opened, $request] = $this->stalledScript();
        [$otherHost, $other, $otherRequest] = $this->stalledScript();
        $this->raise($host, $opened, $request)->assertOk();

        $waiting = $this->raise($otherHost, $other, $otherRequest)->assertOk();

        $this->assertSame(['wait', 30], [$waiting->json('answer'), $waiting->json('retryAfterSeconds')]);
        $this->assertSame(1, NavigationRequest::query()->acrossActors()->count());
    }

    public function test_the_main_agents_own_runtime_is_held_for_the_person(): void
    {
        [$host, $opened, $request] = $this->stalledScript();
        $this->seat(Agent::query()->findOrFail($this->agentIdOf($opened)));

        $held = $this->raise($host, $opened, $request)->assertOk();

        $this->assertSame('held', $held->json('answer'));
        $this->assertSame(0, NavigationRequest::query()->acrossActors()->count());
    }

    public function test_a_raise_for_another_hosts_runtime_or_with_an_oversized_screen_is_refused(): void
    {
        $this->seat(Agent::named('Main', 'main-agent'));
        [$host, $opened, $request] = $this->stalledScript();
        [$otherHost] = $this->stalledScript();

        $this->assertGreaterThanOrEqual(400, $this->raise($otherHost, $opened, $request)->status());
        $tooLong = $this->raise($host, $opened, $request, array_fill(0, 61, 'row'));
        $this->assertGreaterThanOrEqual(400, $tooLong->status());
        $this->assertSame(0, NavigationRequest::query()->acrossActors()->count());
    }

    public function test_an_entry_current_on_the_build_is_answered_and_opens_nothing(): void
    {
        $this->seat(Agent::named('Main', 'main-agent'));
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
        $this->seat(Agent::named('Main', 'main-agent'));
        $entry = $this->libraryEntry('2.1.300');
        [$host, $opened, $request] = $this->stalledScript();

        $answer = $this->raise($host, $opened, $request)->assertOk();

        $this->assertSame(['entry', true, $entry->id], [
            $answer->json('answer'),
            $answer->json('guarded'),
            $answer->json('entry.id'),
        ]);
    }

    public function test_a_stale_or_retired_entry_is_not_answered(): void
    {
        $this->seat(Agent::named('Main', 'main-agent'));
        $this->libraryEntry('2.1.323')->markStaleOn('2.1.323', 'label-missing', []);
        $this->libraryEntry('2.1.323')->retire();
        [$host, $opened, $request] = $this->stalledScript();

        $this->assertSame('opened', $this->raise($host, $opened, $request)->assertOk()->json('answer'));
    }

    public function test_an_entry_the_host_declined_is_not_answered_again(): void
    {
        $this->seat(Agent::named('Main', 'main-agent'));
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
        $this->assertFalse($entry->isCurrentOn('2.1.323'));
        $this->assertTrue($entry->isCurrentOn('2.1.400'));
        $this->assertSame('label-missing at step 1', $entry->builds()['2.1.323']->staleReason);
        $this->assertSame(['Model: <redacted>'], $entry->builds()['2.1.323']->staleScreen);
    }

    public function test_a_stale_entry_raise_keeps_its_hint_and_the_proven_path_supersedes_it(): void
    {
        $this->seat(Agent::named('Main', 'main-agent'));
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
        $this->assertTrue($entry->isCurrentOn('2.1.323'));
    }

    /**
     * An entry of the owner's library, proven on the build, that chooses GPT-6 on the picker the raises show.
     */
    private function libraryEntry(string $build): MenuEntry
    {
        [, $opened] = $this->openRuntime(build: $build);
        $receipt = $this->asOwner($this->keyScript($opened, 'ChangeModel', ['model' => 'GPT-6']));
        $request = DriverRequest::query()->with('runtime')->findOrFail($receipt->requestId);
        $screen = new NavigationScreen(['Model: GPT-5', '❯ GPT-6'], 1, 7);
        $uncertainty = new NavigationUncertainty(NavigationReason::LabelMissing, 2, self::FINGERPRINT, $screen);
        $owner = new ActorIdentity(ActorType::User, 'owner');
        $source = NavigationRequest::raised($request, $owner, $uncertainty, 'source', CarbonImmutable::now());
        $source->cancel();
        $steps = [new MenuStep(self::FINGERPRINT, 'GPT-6', null, null)];

        return MenuEntry::proven($owner, $source, $steps, NavigationCompletion::Goal, 'GPT-6');
    }

    /**
     * A ChangeModel key script on a newly opened runtime of its own host, as the host claimed it.
     *
     * @return array{EnrolledHost, OpenedRuntime, DriverRequest}
     */
    private function stalledScript(): array
    {
        [$host, $opened] = $this->openRuntime();
        $receipt = $this->asOwner($this->keyScript($opened, 'ChangeModel', ['model' => 'GPT-6']));

        return [$host, $opened, DriverRequest::query()->findOrFail($receipt->requestId)];
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
