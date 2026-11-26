<?php

declare(strict_types=1);

namespace Tests\Commands\Navigation;

use App\Access\AccessSettings;
use App\Access\Values\OwnerAuthority;
use App\Actors\Contracts\CurrentActorSetter;
use App\Agents\Drivers\Enums\RequestOutcome;
use App\Agents\Drivers\Enums\RequestProgress;
use App\Assignments\Contracts\AssignmentTransaction;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\CommandBus;
use App\Models\Agents\Agent;
use App\Models\Drivers\DriverRequest;
use App\Models\Drivers\NavigationRequest;
use App\Navigation\Commands\AbandonNavigation\AbandonNavigationCommand;
use App\Navigation\Commands\AnswerNavigation\AnswerNavigationCommand;
use App\Navigation\Enums\NavigationStatus;
use App\Navigation\Values\NavigationAnswer;
use App\Support\ActorReference;
use Tests\Support\Agents\RaisesNavigationRequests;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TestStartAuthority;
use Tests\TestCase;

/**
 * Giving up abandons the request and ends its key script entry as unavailable.
 */
#[TestsCommand(AbandonNavigationCommand::class)]
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
        $this->app->make(CurrentActorSetter::class)->set(ActorReference::forUser('owner'), new OwnerAuthority('test'));
        $this->app->make(AssignmentTransaction::class)->run(
            fn () => $this->journal->seatMainAgent($this->main),
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
            ActorReference::forAgent($agent->id),
            TestStartAuthority::forAgent($agent->id),
        );

        return $this->app->make(CommandBus::class)->run($command);
    }
}
