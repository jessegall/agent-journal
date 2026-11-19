<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\Agents\Commands\AnswerNavigation;
use App\Agents\Contracts\MainSeatTakeover;
use App\Agents\Enums\DriverOperation;
use App\Agents\Enums\NavigationState;
use App\Agents\Exceptions\NavigationAnswerRefused;
use App\Agents\Models\Agent;
use App\Agents\Models\DriverRequest;
use App\Agents\Models\NavigationRequest;
use App\Agents\Values\NavigationAnswer;
use App\Assignments\Contracts\AssignmentTransaction;
use App\Bus\Contracts\CommandBus;
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
    ];

    private Agent $main;

    protected function setUp(): void
    {
        parent::setUp();
        $this->app->instance(AccessSettings::class, new AccessSettings('owner'));
        $this->main = Agent::named('Main', 'main-agent');
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
        $this->assertSame(['down', 'down'], $sent->navigationRound()?->toStored()['keys']);
        $this->assertSame(NavigationState::Answering, $navigation->fresh()?->state);
    }

    public function test_a_stale_round_another_actors_round_or_a_parameter_the_goal_lacks_stores_nothing(): void
    {
        $navigation = $this->raise($this->stalledScript(), 'raise-1');
        $stranger = Agent::named('Helper', 'main-agent');
        $choose = NavigationAnswer::choose('GPT-6');
        $refused = [
            'stale version' => [$this->main, new AnswerNavigation($navigation->id, 9, 7, $choose)],
            'old screen' => [$this->main, new AnswerNavigation($navigation->id, 1, 6, $choose)],
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

    private function answer(NavigationRequest $navigation, NavigationAnswer $answer): AnswerNavigation
    {
        $generation = $navigation->screen->generation;

        return new AnswerNavigation($navigation->id, $navigation->row_version, $generation, $answer);
    }

    private function asAgent(Agent $agent, AnswerNavigation $round): mixed
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forAgent($agent->id),
            TestStartAuthority::forAgent($agent->id),
        );

        return $this->app->make(CommandBus::class)->run($round);
    }

    private function roundCount(NavigationRequest $navigation): int
    {
        return DriverRequest::query()->where('navigation_request_id', $navigation->id)->count();
    }
}
