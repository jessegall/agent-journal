<?php

declare(strict_types=1);

namespace Tests\Commands\Navigation;

use App\Commands\Navigation\AnswerNavigation\AnswerNavigationCommand;
use App\Commands\Navigation\ProveNavigation\ProveNavigationCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Assignments\AssignmentTransaction;
use App\Contracts\Bus\Command;
use App\Contracts\Bus\CommandBus;
use App\Enums\Navigation\NavigationCompletion;
use App\Enums\Navigation\NavigationStatus;
use App\Exceptions\NavigationAnswerRefused;
use App\Exceptions\NavigationProofRefused;
use App\Models\Agents\Agent;
use App\Models\Drivers\DriverRequest;
use App\Models\Drivers\NavigationRequest;
use App\Support\Access\AccessSettings;
use App\Support\ActorContext;
use App\Support\MainInboxTakeover;
use App\Values\NavigationAnswer;
use App\Values\OwnerAuthority;
use Tests\Support\Agents\RaisesNavigationRequests;
use Tests\Support\CommitsHookRows;
use Tests\Support\InstallsInboxes;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\TestStartAuthority;
use Tests\TestCase;

/**
 * Done moves an answered request to proving and queues a proof round; a proof that is empty, was already on the
 * screen or comes too early is refused.
 */
final class ProveNavigationTest extends TestCase
{
    use CommitsHookRows;
    use InstallsInboxes;
    use RaisesNavigationRequests;
    use RunsTrustedCommands;

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
        'inboxes', 'inbox_members',
        'assignments',
        'command_receipts',
        'accounts',
        'active_accounts',
        'session_processes',
    ];

    private Agent $main;

    protected function setUp(): void
    {
        parent::setUp();
        $this->app->instance(AccessSettings::class, new AccessSettings('owner'));
        $this->main = Agent::create('Main', 'main-agent', $this->localProject());
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser('owner'), new OwnerAuthority('test'));
        $this->app->make(AssignmentTransaction::class)->run(
            fn () => $this->app->make(MainInboxTakeover::class)->takeOver($this->main),
        );
    }

    public function test_done_moves_an_answered_request_to_proving_and_queues_a_proof_round(): void
    {
        $navigation = $this->answered();

        $receipt = $this->asAgent(
            $this->main,
            new ProveNavigationCommand($navigation->id, $navigation->row_version, NavigationCompletion::Step, 'Set model'),
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

        $this->assertSame(NavigationStatus::Answering, $navigation->fresh()?->status);
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
}
