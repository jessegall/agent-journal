<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Commands\Navigation\AbandonNavigation\AbandonNavigationCommand;
use App\Commands\Navigation\AnswerNavigation\AnswerNavigationCommand;
use App\Commands\Navigation\ProveNavigation\ProveNavigationCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Assignments\AssignmentTransaction;
use App\Contracts\Bus\Command;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Chat\MainSeatTakeover;
use App\Enums\Drivers\DriverOperation;
use App\Enums\Drivers\RequestOutcome;
use App\Enums\Drivers\RequestProgress;
use App\Enums\Navigation\NavigationCompletion;
use App\Enums\Navigation\NavigationState;
use App\Exceptions\NavigationAnswerRefused;
use App\Exceptions\NavigationProofRefused;
use App\Models\Agents\Agent;
use App\Models\Drivers\DriverRequest;
use App\Models\Drivers\NavigationRequest;
use App\Support\ActorContext;
use App\Values\NavigationAnswer;
use App\Values\OwnerAuthority;
use Domain\Access\Support\AccessSettings;
use Tests\Support\Agents\RaisesNavigationRequests;
use Tests\Support\CommitsHookRows;
use Tests\Support\InstallsDesks;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\TestStartAuthority;
use Tests\TestCase;

/**
 * The main desk's occupant answers a navigation request with one round per row version: keys, a label or a goal
 * parameter, never free text or a control key; a stale round or another actor's round is refused and stores nothing.
 */
final class AnswerNavigationTest extends TestCase
{
    use CommitsHookRows;
    use InstallsDesks;
    use RaisesNavigationRequests;
    use RunsTrustedCommands;

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
        'inboxes',
        'desks',
        'desk_seats',
        'desk_preferences',
        'assignments',
        'command_receipts',
        'accounts',
        'active_accounts',
        'process_starts',
    ];

    private Agent $main;

    protected function setUp(): void
    {
        parent::setUp();
        $this->app->instance(AccessSettings::class, new AccessSettings('owner'));
        $this->main = Agent::create('Main', 'main-agent');
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser('owner'), new OwnerAuthority('test'));
        $this->app->make(AssignmentTransaction::class)->run(
            fn () => $this->app->make(MainSeatTakeover::class)->takeOver($this->main),
        );
    }

    public function test_the_occupants_round_is_sent_once_and_the_request_is_answering(): void
    {
        $navigation = $this->raise($this->stalledScript(), 'raise-1');
        $round = $this->answer($navigation, NavigationAnswer::keys(['down', 'down']));

        $first = $this->asAgent($this->main, $round);
        $again = $this->asAgent($this->main, $round);

        $this->assertSame($first->requestId, $again->requestId);
        $this->assertSame(1, $this->roundCount($navigation));
        $sent = DriverRequest::query()->findOrFail($first->requestId);
        $this->assertSame(DriverOperation::Navigate, $sent->operation);
        $this->assertSame(['down', 'down'], $sent->navigation_round?->toArray()['keys']);
        $this->assertSame(NavigationState::Answering, $navigation->fresh()?->state);
    }

    public function test_a_stale_round_another_actors_round_or_a_parameter_the_goal_lacks_stores_nothing(): void
    {
        $navigation = $this->raise($this->stalledScript(), 'raise-1');
        $stranger = Agent::create('Helper', 'main-agent');
        $choose = NavigationAnswer::choose('GPT-6');
        $refused = [
            'stale version' => [$this->main, new AnswerNavigationCommand($navigation->id, 9, 7, $choose)],
            'old screen' => [$this->main, new AnswerNavigationCommand($navigation->id, 1, 6, $choose)],
            'free text' => [$this->main, $this->answer($navigation, NavigationAnswer::typeParameter('shell'))],
            'another agent' => [$stranger, $this->answer($navigation, NavigationAnswer::confirm('GPT-6'))],
        ];

        foreach ($refused as $name => [$agent, $round]) {
            try {
                $this->asAgent($agent, $round);
                $this->fail("{$name} was sent.");
            } catch (NavigationAnswerRefused) {
                $this->assertSame(0, $this->roundCount($navigation), $name);
            }
        }
    }

    public function test_a_control_key_or_an_endless_label_never_becomes_an_answer(): void
    {
        $answers = [
            fn () => NavigationAnswer::keys(['ctrl-c']),
            fn () => NavigationAnswer::choose(str_repeat('a', 201)),
        ];

        foreach ($answers as $make) {
            try {
                $make();
                $this->fail('A key or label outside the allowed set became an answer.');
            } catch (NavigationAnswerRefused) {
                $this->addToAssertionCount(1);
            }
        }
    }

    public function test_done_moves_an_answered_request_to_proving_and_queues_a_proof_round(): void
    {
        $navigation = $this->answered();

        $receipt = $this->asAgent(
            $this->main,
            new ProveNavigationCommand($navigation->id, $navigation->row_version, NavigationCompletion::Step, 'Set model'),
        );

        $navigation->refresh();
        $this->assertSame(NavigationState::Proving, $navigation->state);
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
            'empty' => [new ProveNavigationCommand($navigation->id, $version, $goal, ' '), NavigationProofRefused::class],
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

        $this->assertSame(NavigationState::Answering, $navigation->fresh()?->state);
    }

    public function test_giving_up_abandons_the_request_and_ends_its_key_script_entry_unavailable(): void
    {
        $navigation = $this->answered();

        $this->asAgent($this->main, new AbandonNavigationCommand($navigation->id, $navigation->row_version, 'no such model'));

        $navigation->refresh();
        $this->assertSame(
            [NavigationState::Abandoned, 'no such model'],
            [$navigation->state, $navigation->abandon_reason],
        );
        $stalled = DriverRequest::query()->findOrFail($navigation->driver_request_id);
        $this->assertSame(
            [RequestProgress::Failed, RequestOutcome::EntryUnavailable],
            [$stalled->progress, $stalled->outcome],
        );
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
            ActorContext::forAgent($agent->id),
            TestStartAuthority::forAgent($agent->id),
        );

        return $this->app->make(CommandBus::class)->run($command);
    }

    private function roundCount(NavigationRequest $navigation): int
    {
        return DriverRequest::query()->where('navigation_request_id', $navigation->id)->count();
    }
}
