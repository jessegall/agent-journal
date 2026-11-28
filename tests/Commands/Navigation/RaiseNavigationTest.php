<?php

declare(strict_types=1);

namespace Tests\Commands\Navigation;

use App\Access\AccessSettings;
use App\Access\Values\OwnerAuthority;
use App\Actors\Contracts\ActorAttention;
use App\Actors\Contracts\CurrentActorSetter;
use App\Agents\Drivers\Enums\HoldReason;
use App\Agents\Drivers\Values\MenuStep;
use App\Assignments\Contracts\AssignmentStorage;
use App\Assignments\Contracts\AssignmentTransaction;
use App\Hosts\EnrolledHost;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\DriverRequest;
use App\Models\Drivers\MenuEntry;
use App\Models\Drivers\NavigationRequest;
use App\Models\Inboxes\Inbox;
use App\Navigation\Commands\RaiseNavigation\RaiseNavigationCommand;
use App\Navigation\Enums\MenuEntryStatus;
use App\Navigation\Enums\NavigationCompletion;
use App\Navigation\Enums\NavigationHandler;
use App\Navigation\Enums\NavigationReason;
use App\Navigation\Enums\NavigationStatus;
use App\Navigation\NavigationDispatch;
use App\Navigation\NavigationLibrary;
use App\Sessions\OpenedRuntime;
use App\Stacks\PendingWorkSources;
use App\Support\ActorReference;
use App\Support\AssigneeIdentity;
use App\Values\NavigationScreen;
use App\Values\NavigationUncertainty;
use Carbon\CarbonImmutable;
use Closure;
use Illuminate\Database\UniqueConstraintViolationException;
use Tests\Fixtures\Agents\RecordedAttention;
use Tests\Support\Agents\RaisesNavigationRequests;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A host whose key script stalled on a screen raises a navigation request for it, once for the same operation; a
 * report from an attempt the request has moved past is refused and raises nothing.
 */
#[TestsCommand(RaiseNavigationCommand::class)]
final class RaiseNavigationTest extends TestCase
{
    use CommitsHookRows;
    use RaisesNavigationRequests;

    private const array TABLES = [
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'hook_calls',
        'hosts',
        'agent_runtimes',
        'driver_requests',
        'navigation_requests',
        'users',
        'inboxes',
        'inbox_members',
        'accounts',
        'active_accounts',
        'session_processes',
        'assignments',
        'menu_entries',
    ];

    private RecordedAttention $attention;

    private const string FINGERPRINT = 'fp1:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

    public function test_a_stalled_key_script_raises_one_request_per_operation(): void
    {
        $this->journal->installInboxes();
        [$host, $opened] = $this->openRuntime();
        $stalled = DriverRequest::query()->findOrFail(
            $this->asOwner($this->keyScript($opened, 'ChangeModel', ['model' => 'GPT-6']))->requestId,
        );

        $first = $this->journal->asSystem($this->raised($host, $stalled, 'raise-1'));
        $again = $this->journal->asSystem($this->raised($host, $stalled, 'raise-1'));

        $this->assertEquals($first, $again);
        $this->assertSame(1, NavigationRequest::query()->acrossActors()->count());
    }

    public function test_a_report_from_a_past_attempt_is_refused_and_raises_nothing(): void
    {
        $this->journal->installInboxes();
        [$host, $opened] = $this->openRuntime();
        $stalled = DriverRequest::query()->findOrFail(
            $this->asOwner($this->keyScript($opened, 'ChangeModel', ['model' => 'GPT-6']))->requestId,
        );

        $this->assertThrows(
            fn () => $this->journal->asSystem($this->raised($host, $stalled, 'raise-1', $stalled->attempt_version + 1)),
        );

        $this->assertSame(0, NavigationRequest::query()->acrossActors()->count());
    }

    public function test_a_helpers_request_goes_to_the_main_inbox_and_wakes_its_member_once_per_round(): void
    {
        $this->journal->installInboxes();
        $this->attention = new RecordedAttention();
        $this->app->bind(ActorAttention::class, fn () => $this->attention);

        $main = $this->seatMain();
        $navigation = $this->raise($this->stalledScript(), 'raise-1');
        $dispatch = $this->app->make(NavigationDispatch::class);

        $handler = $this->inTransaction(fn () => $dispatch->handlerFor($this->runtimeOf($navigation)));
        $this->assertSame(NavigationHandler::MainInbox, $handler);
        $this->inTransaction(fn () => $dispatch->deliver($navigation, 1));
        $this->inTransaction(fn () => $dispatch->deliver($navigation, 1));
        $this->inTransaction(fn () => $dispatch->deliver($navigation, 2));

        $holder = $this->holderOf($navigation);
        $mainInbox = Inbox::findMain();
        $this->assertSame([$mainInbox->assigneeIdentity()->type, $mainInbox->id], [$holder->type, $holder->id]);
        $keys = array_column($this->attention->wakes, 1);
        $this->assertCount(3, $keys);
        $this->assertSame($keys[0], $keys[1]);
        $this->assertNotSame($keys[0], $keys[2]);
        $this->assertTrue($this->attention->wakes[0][0]->isSameAs(ActorReference::of($main)));
        $pending = $this->app->make(PendingWorkSources::class);
        $this->assertTrue($this->inTransaction(fn () => $pending->hasWorkFor(ActorReference::of($main))));
    }

    public function test_the_main_agents_own_runtime_is_held_for_the_user(): void
    {
        $this->journal->installInboxes();
        $this->attention = new RecordedAttention();
        $this->app->bind(ActorAttention::class, fn () => $this->attention);

        $navigation = $this->raise($this->stalledScript(), 'raise-1');
        $runtime = $this->runtimeOf($navigation);
        $this->seat($runtime->session->agent);

        $dispatch = $this->app->make(NavigationDispatch::class);
        $handler = $this->inTransaction(fn () => $dispatch->handlerFor($runtime));

        $this->assertSame(NavigationHandler::User, $handler);
    }

    public function test_with_nobody_attached_the_request_waits_at_the_inbox_and_wakes_nobody(): void
    {
        $this->journal->installInboxes();
        $this->attention = new RecordedAttention();
        $this->app->bind(ActorAttention::class, fn () => $this->attention);

        $navigation = $this->raise($this->stalledScript(), 'raise-1');

        $dispatch = $this->app->make(NavigationDispatch::class);
        $this->inTransaction(fn () => $dispatch->deliver($navigation, 1));

        $this->assertSame([], $this->attention->wakes);
        $mainInbox = Inbox::findMain();
        $this->assertSame($mainInbox->id, $this->holderOf($navigation)->id);
    }

    public function test_a_raise_opens_one_request_holds_the_runtime_and_wakes_once_when_sent_twice(): void
    {
        $this->journal->installInboxes();
        $this->app->instance(AccessSettings::class, new AccessSettings('owner'));
        $this->attention = new RecordedAttention();
        $this->app->bind(ActorAttention::class, fn () => $this->attention);

        $this->seat(Agent::create('Main', 'main-agent', $this->localProject()));
        [$host, $opened, $request] = $this->stalledScriptOnHost();

        $first = $this->raiseThroughHost($host, $opened, $request);
        $second = $this->raiseThroughHost($host, $opened, $request);

        $this->assertSame('opened', data_get($first, 'answer'));
        $this->assertSame(data_get($first, 'requestId'), data_get($second, 'requestId'));
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
        $this->journal->installInboxes();
        $this->app->instance(AccessSettings::class, new AccessSettings('owner'));
        $this->attention = new RecordedAttention();
        $this->app->bind(ActorAttention::class, fn () => $this->attention);

        $this->seat(Agent::create('Main', 'main-agent', $this->localProject()));
        [$host, $opened, $request] = $this->stalledScriptOnHost();
        [$otherHost, $other, $otherRequest] = $this->stalledScriptOnHost();
        $this->raiseThroughHost($host, $opened, $request);

        $waiting = $this->raiseThroughHost($otherHost, $other, $otherRequest);

        $this->assertSame(['wait', 30], [data_get($waiting, 'answer'), data_get($waiting, 'retryAfterSeconds')]);
        $this->assertSame(1, NavigationRequest::query()->acrossActors()->count());
    }

    #[TimeLimit(seconds: 30, reason: 'It opens fifty runtimes with different goals before the matching raise.')]
    public function test_an_exact_open_goal_is_found_behind_fifty_different_goals(): void
    {
        $this->journal->installInboxes();
        $this->app->instance(AccessSettings::class, new AccessSettings('owner'));
        $this->attention = new RecordedAttention();
        $this->app->bind(ActorAttention::class, fn () => $this->attention);

        $this->seat(Agent::create('Main', 'main-agent', $this->localProject()));
        [, , $matching] = $this->stalledScriptOnHost();
        $this->navigationFor($matching);
        $this->travel(1)->seconds();

        for ($number = 1; $number <= 50; $number++) {
            [, , $different] = $this->stalledScriptOnHost("Model {$number}");
            $this->navigationFor($different);
        }

        [$host, $opened, $request] = $this->stalledScriptOnHost();

        $answer = $this->raiseThroughHost($host, $opened, $request);

        $this->assertSame('wait', data_get($answer, 'answer'));
        $this->assertSame(51, NavigationRequest::query()->acrossActors()->count());
    }

    public function test_a_raise_from_the_main_agents_own_runtime_is_answered_held_and_opens_nothing(): void
    {
        $this->journal->installInboxes();
        $this->app->instance(AccessSettings::class, new AccessSettings('owner'));
        $this->attention = new RecordedAttention();
        $this->app->bind(ActorAttention::class, fn () => $this->attention);

        [$host, $opened, $request] = $this->stalledScriptOnHost();
        $this->seat(Agent::query()->findOrFail($this->agentIdOf($opened)));

        $held = $this->raiseThroughHost($host, $opened, $request);

        $this->assertSame('held', data_get($held, 'answer'));
        $this->assertSame(0, NavigationRequest::query()->acrossActors()->count());
    }

    public function test_a_raise_for_another_hosts_runtime_or_with_an_oversized_screen_is_refused(): void
    {
        $this->journal->installInboxes();
        $this->app->instance(AccessSettings::class, new AccessSettings('owner'));
        $this->attention = new RecordedAttention();
        $this->app->bind(ActorAttention::class, fn () => $this->attention);

        $this->seat(Agent::create('Main', 'main-agent', $this->localProject()));
        [$host, $opened, $request] = $this->stalledScriptOnHost();
        [$otherHost] = $this->stalledScriptOnHost();

        $this->assertThrows(fn () => $this->raiseThroughHost($otherHost, $opened, $request));
        $this->assertSame(0, NavigationRequest::query()->acrossActors()->count());
    }

    public function test_an_entry_current_on_the_build_is_answered_and_opens_nothing(): void
    {
        $this->journal->installInboxes();
        $this->app->instance(AccessSettings::class, new AccessSettings('owner'));
        $this->attention = new RecordedAttention();
        $this->app->bind(ActorAttention::class, fn () => $this->attention);

        $this->seat(Agent::create('Main', 'main-agent', $this->localProject()));
        $entry = $this->libraryEntry('2.1.332');
        [$host, $opened, $request] = $this->stalledScriptOnHost();
        $before = NavigationRequest::query()->acrossActors()->count();
        $wakes = count($this->attention->wakes);

        $answer = $this->raiseThroughHost($host, $opened, $request);

        $this->assertSame(['entry', false, $entry->id], [
            data_get($answer, 'answer'),
            data_get($answer, 'isGuarded'),
            data_get($answer, 'entry.id'),
        ]);
        $this->assertSame('GPT-6', data_get($answer, 'entry.steps.0.choose'));
        $this->assertSame($before, NavigationRequest::query()->acrossActors()->count());
        $this->assertCount($wakes, $this->attention->wakes);
    }

    public function test_an_entry_proven_on_another_build_only_is_answered_guarded(): void
    {
        $this->journal->installInboxes();
        $this->app->instance(AccessSettings::class, new AccessSettings('owner'));
        $this->attention = new RecordedAttention();
        $this->app->bind(ActorAttention::class, fn () => $this->attention);

        $this->seat(Agent::create('Main', 'main-agent', $this->localProject()));
        $entry = $this->libraryEntry('2.1.300');
        [$host, $opened, $request] = $this->stalledScriptOnHost();

        $answer = $this->raiseThroughHost($host, $opened, $request);

        $this->assertSame(['entry', true, $entry->id], [
            data_get($answer, 'answer'),
            data_get($answer, 'isGuarded'),
            data_get($answer, 'entry.id'),
        ]);
    }

    public function test_build_proof_wins_over_twenty_newer_guarded_entries(): void
    {
        $this->journal->installInboxes();
        $this->app->instance(AccessSettings::class, new AccessSettings('owner'));
        $this->attention = new RecordedAttention();
        $this->app->bind(ActorAttention::class, fn () => $this->attention);

        $this->seat(Agent::create('Main', 'main-agent', $this->localProject()));
        $entry = $this->libraryEntry('2.1.332');
        $this->travel(1)->seconds();
        $this->addPaths($this->librarySource('2.1.300'));
        [$host, $opened, $request] = $this->stalledScriptOnHost();

        $answer = $this->raiseThroughHost($host, $opened, $request);

        $this->assertSame($entry->id, data_get($answer, 'entry.id'));
        $this->assertFalse(data_get($answer, 'isGuarded'));
    }

    public function test_a_guarded_entry_is_found_behind_twenty_newer_stale_entries(): void
    {
        $this->journal->installInboxes();
        $this->app->instance(AccessSettings::class, new AccessSettings('owner'));
        $this->attention = new RecordedAttention();
        $this->app->bind(ActorAttention::class, fn () => $this->attention);

        $this->seat(Agent::create('Main', 'main-agent', $this->localProject()));
        $entry = $this->libraryEntry('2.1.300');
        $this->travel(1)->seconds();
        $this->addPaths($this->librarySource('2.1.332'), ['2.1.332']);
        [$host, $opened, $request] = $this->stalledScriptOnHost();

        $answer = $this->raiseThroughHost($host, $opened, $request);

        $this->assertSame($entry->id, data_get($answer, 'entry.id'));
        $this->assertTrue(data_get($answer, 'isGuarded'));
    }

    public function test_saving_reuses_the_exact_path_behind_twenty_newer_paths(): void
    {
        $this->journal->installInboxes();
        $this->app->instance(AccessSettings::class, new AccessSettings('owner'));
        $this->attention = new RecordedAttention();
        $this->app->bind(ActorAttention::class, fn () => $this->attention);

        $entry = $this->libraryEntry('2.1.300');
        $this->travel(1)->seconds();
        $navigation = $this->librarySource('2.1.332');
        $this->addPaths($navigation);

        $saved = $this->app->make(AssignmentTransaction::class)->run(
            fn () => $this->app->make(NavigationLibrary::class)->save($navigation, $entry->steps->items()),
        );

        $this->assertSame($entry->id, $saved->id);
        $this->assertSame(false, $saved->buildOn('2.1.332')?->isStale);
        $this->assertSame(21, MenuEntry::query()->acrossActors()->count());
    }

    public function test_a_stale_entry_is_not_answered(): void
    {
        $this->journal->installInboxes();
        $this->app->instance(AccessSettings::class, new AccessSettings('owner'));
        $this->attention = new RecordedAttention();
        $this->app->bind(ActorAttention::class, fn () => $this->attention);

        $this->seat(Agent::create('Main', 'main-agent', $this->localProject()));
        $this->libraryEntry('2.1.332')->markStaleOn('2.1.332', 'label-missing', []);
        [$host, $opened, $request] = $this->stalledScriptOnHost();

        $this->assertSame('opened', $this->raiseThroughHost($host, $opened, $request)['answer']);
    }

    public function test_an_entry_the_host_declined_is_not_answered_again(): void
    {
        $this->journal->installInboxes();
        $this->app->instance(AccessSettings::class, new AccessSettings('owner'));
        $this->attention = new RecordedAttention();
        $this->app->bind(ActorAttention::class, fn () => $this->attention);

        $this->seat(Agent::create('Main', 'main-agent', $this->localProject()));
        $entry = $this->libraryEntry('2.1.332');
        [$host, $opened, $request] = $this->stalledScriptOnHost();

        $answer = $this->raiseThroughHost($host, $opened, $request, declined: [$entry->id]);

        $this->assertSame('opened', data_get($answer, 'answer'));
    }

    public function test_a_stale_entry_raise_keeps_its_hint_and_the_proven_path_supersedes_it(): void
    {
        $this->journal->installInboxes();
        $this->app->instance(AccessSettings::class, new AccessSettings('owner'));
        $this->attention = new RecordedAttention();
        $this->app->bind(ActorAttention::class, fn () => $this->attention);

        $this->seat(Agent::create('Main', 'main-agent', $this->localProject()));
        $stale = $this->libraryEntry('2.1.332');
        $stale->markStaleOn('2.1.332', 'label-missing at step 1', []);
        [$host, $opened, $request] = $this->stalledScriptOnHost();

        $answer = $this->raiseThroughHost($host, $opened, $request, staleEntry: $stale->id, sentSteps: ['choose GPT-6']);

        $navigation = NavigationRequest::query()->acrossActors()->findOrFail(data_get($answer, 'requestId'));
        $this->assertSame([$stale->id, ['choose GPT-6']], [$navigation->stale_entry_id, $navigation->sent_steps]);
        $navigation->answer();
        $navigation->prove(NavigationCompletion::Goal, null, 'GPT-6');
        $saved = $this->app->make(AssignmentTransaction::class)->run(fn () => $this->app->make(NavigationLibrary::class)
            ->save($navigation, [new MenuStep(self::FINGERPRINT, 'GPT-7', null, null)]));
        $this->assertSame(MenuEntryStatus::Superseded, $stale->fresh()?->status);
        $this->assertSame(MenuEntryStatus::Current, $saved->status);
    }

    public function test_a_raised_request_carries_its_script_goal_runtime_and_screen(): void
    {
        $stalled = $this->stalledScript();

        $navigation = $this->raise($stalled, 'raise-1');

        $this->assertSame(NavigationStatus::Open, $navigation->status);
        $this->assertSame([$stalled->id, $stalled->agent_runtime_id], [
            $navigation->driver_request_id,
            $navigation->agent_runtime_id,
        ]);
        $this->assertSame(['claude-code', '2.1.332'], [$navigation->family, $navigation->build]);
        $this->assertEquals($stalled->scriptGoal(), $navigation->goal);
        $this->assertSame(['Model: GPT-5', '❯ GPT-6'], $navigation->fresh()?->screen->rows);
        $this->assertSame(['Model: GPT-5', '❯ GPT-6'], $navigation->raise_rows);
        $this->assertSame(1, $navigation->row_version);
    }

    public function test_the_same_raise_is_one_row_and_a_second_open_request_is_refused_by_the_database(): void
    {
        $stalled = $this->stalledScript();
        $first = $this->raise($stalled, 'raise-1');

        $this->assertSame($first->id, $this->raise($stalled, 'raise-1')->id);

        $this->expectException(UniqueConstraintViolationException::class);
        $this->raise($stalled, 'raise-2');
    }

    /**
     * The host's raise of the request stalled at its step 2 on the model picker, in the attempt given or its own.
     */
    private function raised(
        EnrolledHost $host,
        DriverRequest $stalled,
        string $operationKey,
        int|null $attempt = null,
    ): RaiseNavigationCommand {
        return new RaiseNavigationCommand(
            $host->hostId,
            $stalled->agent_runtime_id,
            $operationKey,
            $stalled->id,
            $attempt ?? $stalled->attempt_version,
            $this->uncertainty(['Model: GPT-5', '❯ GPT-6'], 'fp1:'.str_repeat('a', 64), null, []),
        );
    }

    /**
     * @param  list<string>  $rows
     * @param  list<string>  $sentSteps
     */
    private function uncertainty(
        array $rows,
        string $fingerprint,
        string|null $staleEntry,
        array $sentSteps,
    ): NavigationUncertainty {
        return new NavigationUncertainty(
            NavigationReason::LabelMissing,
            2,
            $fingerprint,
            new NavigationScreen($rows, 1, 7),
            $staleEntry,
            $sentSteps,
        );
    }

    /**
     * @template TResult
     *
     * @param  Closure(): TResult  $work
     * @return TResult
     */
    private function inTransaction(Closure $work): mixed
    {
        return $this->app->make(AssignmentTransaction::class)->run($work);
    }

    private function holderOf(NavigationRequest $navigation): AssigneeIdentity
    {
        $storage = $this->app->make(AssignmentStorage::class);

        return $this->inTransaction(fn () => $storage->lockCurrent($navigation->assignmentIdentity())->get()->holder());
    }

    private function seat(Agent $agent): void
    {
        $this->app->make(CurrentActorSetter::class)->set(ActorReference::forUser('owner'), new OwnerAuthority('test'));
        $this->inTransaction(fn () => $this->journal->seatMainAgent($agent));
    }

    private function seatMain(): Agent
    {
        $main = Agent::create('Main', 'main-agent', $this->localProject());
        $this->seat($main);

        return $main;
    }

    private function runtimeOf(NavigationRequest $navigation): AgentRuntime
    {
        return AgentRuntime::query()->with('session.agent')->findOrFail($navigation->agent_runtime_id);
    }

    /**
     * The host's raise of the request stalled at its step 2 on the model picker, answered as the host reads it.
     *
     * @param  list<string>  $rows
     * @param  list<string>  $declined
     * @param  list<string>  $sentSteps  the steps the stale entry's replay already sent
     * @return array<string, mixed>
     */
    private function raiseThroughHost(
        EnrolledHost $host,
        OpenedRuntime $opened,
        DriverRequest $request,
        array $rows = ['Model: GPT-5', '❯ GPT-6'],
        array $declined = [],
        string|null $staleEntry = null,
        array $sentSteps = [],
    ): array {
        $answer = $this->journal->asSystem(new RaiseNavigationCommand(
            $host->hostId,
            $opened->runtimeId,
            "{$request->id}:{$request->attempt_version}:2",
            $request->id,
            $request->attempt_version,
            $this->uncertainty($rows, self::FINGERPRINT, $staleEntry, $sentSteps),
            $declined,
        ));

        return json_decode((string) json_encode($answer), true, flags: JSON_THROW_ON_ERROR);
    }

    /**
     * A ChangeModel key script on a newly opened runtime of its own host, as the host claimed it.
     *
     * @return array{EnrolledHost, OpenedRuntime, DriverRequest}
     */
    private function stalledScriptOnHost(string $model = 'GPT-6'): array
    {
        [$host, $opened] = $this->openRuntime();
        $receipt = $this->asOwner($this->keyScript($opened, 'ChangeModel', ['model' => $model]));

        return [$host, $opened, DriverRequest::query()->with('runtime')->findOrFail($receipt->requestId)];
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
        $owner = ActorReference::ofClass(User::class, 'owner');

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
     * An entry of the owner's library, proven on the build, that chooses GPT-6 on the picker the raises show.
     */
    private function libraryEntry(string $build): MenuEntry
    {
        $source = $this->librarySource($build);
        $steps = [new MenuStep(self::FINGERPRINT, 'GPT-6', null, null)];

        return MenuEntry::create($source->actor(), $source, $steps, NavigationCompletion::Goal, 'GPT-6');
    }
}
