<?php

declare(strict_types=1);

namespace Tests\Commands\Navigation;

use App\Commands\Navigation\AbandonNavigation\AbandonNavigationCommand;
use App\Commands\Navigation\AnswerNavigation\AnswerNavigationCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Assignments\AssignmentTransaction;
use App\Contracts\Bus\Command;
use App\Contracts\Bus\CommandBus;
use App\Enums\Drivers\RequestOutcome;
use App\Enums\Drivers\RequestProgress;
use App\Enums\Navigation\NavigationStatus;
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
 * Giving up abandons the request and ends its key script entry as unavailable.
 */
final class AbandonNavigationTest extends TestCase
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
        $this->main = $this->journal->idleAgent('Main', 'main-agent')->agentCalled('Main');
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser('owner'), new OwnerAuthority('test'));
        $this->app->make(AssignmentTransaction::class)->run(
            fn () => $this->app->make(MainInboxTakeover::class)->takeOver($this->main),
        );
    }

    public function test_giving_up_abandons_the_request_and_ends_its_key_script_entry_unavailable(): void
    {
        $navigation = $this->answered();

        $this->asAgent(
            $this->main,
            new AbandonNavigationCommand($navigation->id, $navigation->row_version, 'no such model'),
        );

        $navigation->refresh();
        $this->assertSame(
            [NavigationStatus::Abandoned, 'no such model'],
            [$navigation->status, $navigation->abandon_reason],
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
}
