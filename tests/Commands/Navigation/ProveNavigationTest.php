<?php

declare(strict_types=1);

namespace Tests\Commands\Navigation;

use App\Access\AccessSettings;
use App\Access\Values\OwnerAuthority;
use App\Actors\Contracts\ActorAttention;
use App\Actors\Contracts\CurrentActorSetter;
use App\Agents\DriverRequestEndings;
use App\Agents\Drivers\Commands\NotifyRequestProgress\NotifyRequestProgressCommand;
use App\Agents\Drivers\Enums\HoldReason;
use App\Agents\Drivers\Enums\RequestProgress;
use App\Agents\Drivers\Values\MenuStep;
use App\Assignments\Contracts\AssignmentTransaction;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\CommandBus;
use App\Hosts\EnrolledHost;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\DriverRequest;
use App\Models\Drivers\MenuEntry;
use App\Models\Drivers\NavigationRequest;
use App\Navigation\Commands\AnswerNavigation\AnswerNavigationCommand;
use App\Navigation\Commands\ProveNavigation\ProveNavigationCommand;
use App\Navigation\Enums\NavigationCompletion;
use App\Navigation\Enums\NavigationKey;
use App\Navigation\Enums\NavigationStatus;
use App\Navigation\Exceptions\NavigationAnswerRefused;
use App\Navigation\Exceptions\NavigationProofRefused;
use App\Navigation\NavigationRounds;
use App\Navigation\Values\NavigationAnswer;
use App\Support\ActorReference;
use App\Values\NavigationRound;
use App\Values\NavigationRoundReport;
use Tests\Fixtures\Agents\RecordedAttention;
use Tests\Support\Agents\RaisesNavigationRequests;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TestStartAuthority;
use Tests\TestCase;

/**
 * Done moves an answered request to proving and queues a proof round; a proof that is empty, was already on the
 * screen or comes too early is refused.
 */
#[TestsCommand(ProveNavigationCommand::class)]
final class ProveNavigationTest extends TestCase
{
    use CommitsHookRows;
    use RaisesNavigationRequests;

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
        'inboxes',
        'inbox_members',
        'assignments',
        'command_receipts',
        'accounts',
        'active_accounts',
        'session_processes',
        'menu_entries',
    ];

    private Agent $main;

    private const string SAVED_EVIDENCE = 'proven, saved as menu entry %s';

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->installInboxes();
        $this->app->instance(AccessSettings::class, new AccessSettings('owner'));
        $this->main = $this->journal->idleAgent('Main', 'main-agent')->agentCalled('Main');
        $this->app->make(CurrentActorSetter::class)->set(ActorReference::forUser('owner'), new OwnerAuthority('test'));
        $this->app->make(AssignmentTransaction::class)->run(
            fn () => $this->journal->seatMainAgent($this->main),
        );
    }

    public function test_done_moves_an_answered_request_to_proving_and_queues_a_proof_round(): void
    {
        $navigation = $this->answered();

        $receipt = $this->asAgent(
            $this->main,
            new ProveNavigationCommand(
                $navigation->id,
                $navigation->row_version,
                NavigationCompletion::Step,
                'Set model',
            ),
        );

        $navigation->refresh();
        $this->assertSame(NavigationStatus::Proving, $navigation->status);
        $this->assertSame(['Set model', NavigationCompletion::Step, 3], [
            $navigation->proof,
            $navigation->completes,
            $navigation->next_step,
        ]);
        $round = DriverRequest::query()->findOrFail($receipt->requestId)->navigation_round;
        $this->assertSame(['Set model', 3], [$round?->proof, $round?->nextStep]);
    }

    public function test_a_proof_that_is_empty_or_was_already_on_screen_or_comes_too_early_is_refused(): void
    {
        $navigation = $this->answered();
        $version = $navigation->row_version;
        $goal = NavigationCompletion::Goal;
        $refused = [
            'empty' => [
                new ProveNavigationCommand($navigation->id, $version, $goal, ' '),
                NavigationProofRefused::class,
            ],
            'on screen' => [
                new ProveNavigationCommand($navigation->id, $version, $goal, 'gpt-5'),
                NavigationProofRefused::class,
            ],
        ];
        $open = $this->raise($this->stalledScript(), 'raise-2');
        $refused['not answering'] = [
            new ProveNavigationCommand($open->id, $open->row_version, NavigationCompletion::Goal, 'GPT-6'),
            NavigationAnswerRefused::class,
        ];

        foreach ($refused as $name => [$command, $refusal]) {
            $this->assertThrows(fn () => $this->asAgent($this->main, $command), $refusal, null);
        }

        $this->assertSame(NavigationStatus::Answering, $navigation->fresh()?->status);
    }

    public function test_a_proof_seen_for_the_goal_finishes_the_key_script_and_releases_the_runtime(): void
    {
        $attention = new RecordedAttention();
        $this->app->bind(ActorAttention::class, fn () => $attention);

        [$host, $navigation] = $this->stalled();
        $navigation->answer();
        $navigation->prove(NavigationCompletion::Goal, null, 'GPT-6');
        $round = $this->append($navigation, $this->proofRound($navigation, NavigationCompletion::Goal, null));

        $this->notify($host, $round, isProofSeen: true);

        $this->assertSame(NavigationStatus::Proven, $navigation->fresh()?->status);
        $stalled = DriverRequest::query()->findOrFail($navigation->driver_request_id);
        $this->assertSame(RequestProgress::Applied, $stalled->progress);
        $runtime = AgentRuntime::query()->findOrFail($navigation->agent_runtime_id);
        $this->assertSame(HoldReason::None, $runtime->hold_reason);
    }

    public function test_a_proof_seen_for_a_step_resumes_the_key_script_at_its_next_step(): void
    {
        $attention = new RecordedAttention();
        $this->app->bind(ActorAttention::class, fn () => $attention);

        [$host, $navigation] = $this->stalled();
        $attempt = DriverRequest::query()->findOrFail($navigation->driver_request_id)->attempt_version;
        $navigation->answer();
        $navigation->prove(NavigationCompletion::Step, 4, 'GPT-6');
        $round = $this->append($navigation, $this->proofRound($navigation, NavigationCompletion::Step, 4));

        $this->notify($host, $round, isProofSeen: true);

        $stalled = DriverRequest::query()->findOrFail($navigation->driver_request_id);
        $this->assertSame([4, $attempt + 1, RequestProgress::Accepted], [
            $stalled->script_step,
            $stalled->attempt_version,
            $stalled->progress,
        ]);
    }

    public function test_a_proof_not_seen_sends_the_main_agent_back_to_answering(): void
    {
        $attention = new RecordedAttention();
        $this->app->bind(ActorAttention::class, fn () => $attention);

        [$host, $navigation] = $this->stalled();
        $navigation->answer();
        $navigation->prove(NavigationCompletion::Goal, null, 'GPT-6');
        $round = $this->append($navigation, $this->proofRound($navigation, NavigationCompletion::Goal, null));

        $this->notify($host, $round, isProofSeen: false);

        $this->assertSame(NavigationStatus::Answering, $navigation->fresh()?->status);
    }

    public function test_an_ended_request_cancels_its_queued_rounds_and_refuses_their_report(): void
    {
        $attention = new RecordedAttention();
        $this->app->bind(ActorAttention::class, fn () => $attention);

        [$host, $navigation] = $this->stalled();
        $reported = $this->append($navigation, NavigationRound::keys($navigation->id, 2, 7, [NavigationKey::Esc]));
        $this->journal->claimRequestsOnHost($host->hostId);
        $queued = $this->append($navigation, NavigationRound::keys($navigation->id, 3, 7, [NavigationKey::Esc]));

        $this->app->make(DriverRequestEndings::class)->cancelNavigation($navigation);

        $this->assertSame(RequestProgress::Cancelled, $queued->fresh()?->progress);
        $this->assertThrows(fn () => $this->notify($host, $reported, isProofSeen: false));
    }

    public function test_a_proven_path_is_saved_once_as_a_menu_entry_and_named_in_the_evidence(): void
    {
        $attention = new RecordedAttention();
        $this->app->bind(ActorAttention::class, fn () => $attention);

        [$host, $navigation] = $this->stalled();
        $round = $this->proved($navigation);

        $this->notify($host, $round, isProofSeen: true, steps: [$this->step()]);

        $entry = MenuEntry::query()->acrossActors()->sole();
        $this->assertSame($entry->id, $navigation->fresh()?->library_entry_id);
        $this->assertSame(
            [$this->step()->toArray()],
            array_map(fn (MenuStep $step) => $step->toArray(), $entry->steps->items()),
        );
        $stalled = DriverRequest::query()->findOrFail($navigation->driver_request_id);
        $this->assertSame(sprintf(self::SAVED_EVIDENCE, $entry->id), $stalled->script_evidence);

        [$otherHost, $other] = $this->stalled('2.1.400');
        $this->notify($otherHost, $this->proved($other), isProofSeen: true, steps: [$this->step()]);
        $this->assertSame(1, MenuEntry::query()->acrossActors()->count());
        $this->assertSame(false, MenuEntry::query()->acrossActors()->sole()->buildOn('2.1.400')?->isStale);
    }

    /**
     * A navigation request the main agent has sent its first round to.
     */
    private function answered(): NavigationRequest
    {
        $navigation = $this->raise($this->stalledScript(), 'raise-1');
        $this->asAgent($this->main, $this->answer($navigation, NavigationAnswer::keys(['down'])));

        return NavigationRequest::query()->acrossActors()->findOrFail($navigation->id);
    }

    private function answer(NavigationRequest $navigation, NavigationAnswer $answer): AnswerNavigationCommand
    {
        $generation = $navigation->screen->generation;

        return new AnswerNavigationCommand($navigation->id, $navigation->row_version, $generation, $answer);
    }

    /**
     * Runs a command of the main agent's on the bus as the agent.
     *
     * @template TResult
     *
     * @param  Command<TResult>  $command
     * @return TResult
     */
    private function asAgent(Agent $agent, Command $command): mixed
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorReference::forAgent($agent->id),
            TestStartAuthority::forAgent($agent->id),
        );

        return $this->app->make(CommandBus::class)->run($command);
    }

    private function proofRound(
        NavigationRequest $navigation,
        NavigationCompletion $completes,
        int|null $nextStep,
    ): NavigationRound {
        return NavigationRound::proof($navigation->id, $navigation->row_version, 7, 'GPT-6', $completes, $nextStep);
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
     * @param  list<MenuStep>  $steps
     */
    private function notify(EnrolledHost $host, DriverRequest $round, bool $isProofSeen, array $steps = []): void
    {
        $this->journal->asSystem(new NotifyRequestProgressCommand(
            $host->hostId,
            $round->id,
            (int) $round->fresh()?->attempt_version,
            RequestProgress::Applied,
            'navigation',
            null,
            navigation: new NavigationRoundReport(['Model: GPT-6'], null, 8, $isProofSeen, null, $steps),
        ));
    }

    private function step(): MenuStep
    {
        return new MenuStep('fp1:'.str_repeat('b', 64), 'GPT-6', null, null);
    }

    private function append(NavigationRequest $navigation, NavigationRound $round): DriverRequest
    {
        return $this->app->make(AssignmentTransaction::class)->run(
            fn () => $this->app->make(NavigationRounds::class)->append($navigation, $round),
        );
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
}
