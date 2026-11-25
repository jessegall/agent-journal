<?php

declare(strict_types=1);

namespace Tests\Commands\Navigation;

use App\Commands\Navigation\AnswerNavigation\AnswerNavigationCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Assignments\AssignmentTransaction;
use App\Contracts\Bus\Command;
use App\Contracts\Bus\CommandBus;
use App\Enums\Drivers\DriverOperation;
use App\Enums\Navigation\NavigationStatus;
use App\Exceptions\NavigationAnswerRefused;
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
use Tests\Support\TestStartAuthority;
use Tests\TestCase;

/**
 * An agent answers a screen it was asked to pass: the occupant's round is sent once and the request is answering; a
 * stale round, another actor's round or a parameter the goal lacks stores nothing, and a control key or an endless
 * label never becomes an answer.
 */
final class AnswerNavigationTest extends TestCase
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

        $this->journal->installInboxes();
        $this->app->instance(AccessSettings::class, new AccessSettings('owner'));
        $this->main = Agent::create('Main', 'main-agent', $this->localProject());
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser('owner'), new OwnerAuthority('test'));
        $this->app->make(AssignmentTransaction::class)->run(
            fn () => $this->app->make(MainInboxTakeover::class)->takeOver($this->main),
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
        $this->assertSame(NavigationStatus::Answering, $navigation->fresh()?->status);
    }

    public function test_a_stale_round_another_actors_round_or_a_parameter_the_goal_lacks_stores_nothing(): void
    {
        $navigation = $this->raise($this->stalledScript(), 'raise-1');
        $stranger = Agent::create('Helper', 'main-agent', $this->localProject());
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
