<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Actors\Exceptions\ActorNotAllowed;
use App\Agents\Actions\LaunchSessions;
use App\Agents\Exceptions\StackTargetRefused;
use App\Agents\Models\Agent;
use App\Agents\Support\LaunchedAgent;
use App\Agents\Support\StackTarget;
use App\Domains\Support\DomainEntry;
use App\Hooks\Actions\UserStacks;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Enums\NoSubject;
use App\Hooks\Events\StateTypesRequested;
use App\Hooks\Exceptions\StackTransactionRequired;
use App\Hooks\Models\AgentStackRow;
use App\Hooks\Storage\FrameRecord;
use App\Hooks\Support\StackTransaction;
use Illuminate\Support\Facades\Event;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Fixtures\Hooks\ClosureStateLoader;
use Tests\Fixtures\Hooks\SwitchableState;
use Tests\Fixtures\Modules\Notes\NotesDomain;
use Tests\Support\ActsAsActors;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * A user pushes a state onto a running agent's stack without an agent context; the agent stays the target.
 */
final class UserStacksTest extends TestCase
{
    use ActsAsActors;
    use CommitsHookRows;

    private const array TABLES = [
        'agents',
        'agent_sessions',
        'launch_credentials',
        'agent_stacks',
        'hook_calls',
        'links',
    ];

    private StackTarget $target;

    protected function setUp(): void
    {
        parent::setUp();

        DomainEntry::fromClass(NotesDomain::class)->boot($this->app);
        Event::listen(
            StateTypesRequested::class,
            fn (StateTypesRequested $event) => $event->registry->register(
                'test.switched_off',
                new ClosureStateLoader(fn () => new SwitchableState(false)),
            ),
        );
        $this->target = $this->targetOf($this->launch());
    }

    public function test_a_user_pushes_a_state_onto_a_running_agents_stack(): void
    {
        $this->actAs(TestActors::user(7));

        $this->pushInTransaction($this->target);

        $this->assertSame(['hooks.ready', 'notes.writing'], $this->storedTypeKeys());
    }

    public function test_a_user_push_of_a_switched_off_conditional_state_stores_nothing(): void
    {
        $this->actAs(TestActors::user(7));

        $this->app->make(StackTransaction::class)->run(
            fn () => $this->app->make(UserStacks::class)->push(
                $this->target,
                new StateReference('test.switched_off', NoSubject::None),
            ),
        );

        $this->assertSame(['hooks.ready'], $this->storedTypeKeys());
    }

    public function test_an_agent_without_the_steer_ability_cannot_push_onto_a_stack(): void
    {
        $this->actAsAgent($this->target->agentId);

        $this->expectException(ActorNotAllowed::class);

        $this->pushInTransaction($this->target);
    }

    public function test_a_guessed_session_is_refused(): void
    {
        $this->actAs(TestActors::user(7));

        $this->expectException(StackTargetRefused::class);

        $this->pushInTransaction(new StackTarget($this->target->agentId, TestIds::of(99999)));
    }

    public function test_a_session_of_another_agent_is_refused(): void
    {
        $other = $this->targetOf($this->launch());
        $this->actAs(TestActors::user(7));

        $this->expectException(StackTargetRefused::class);

        $this->pushInTransaction(new StackTarget($this->target->agentId, $other->sessionId));
    }

    public function test_the_push_runs_only_inside_a_stack_transaction(): void
    {
        $this->actAs(TestActors::user(7));

        $this->expectException(StackTransactionRequired::class);

        $this->app->make(UserStacks::class)->push($this->target, new StateReference('notes.writing', NoSubject::None));
    }

    private function pushInTransaction(StackTarget $target): void
    {
        $this->app->make(StackTransaction::class)->run(
            fn () => $this->app->make(UserStacks::class)->push(
                $target,
                new StateReference('notes.writing', NoSubject::None),
            ),
        );
    }

    /**
     * Acts as the agent under the profile it launches with, as a real agent call does.
     */
    private function launch(): LaunchedAgent
    {
        $agent = Agent::named('Test agent', 'main-agent');

        return $this->app->make(LaunchSessions::class)->launch(
            $agent,
            TestSelections::of('claude-code'),
            TestSelections::requestId(),
        );
    }

    private function targetOf(LaunchedAgent $launched): StackTarget
    {
        return new StackTarget($launched->session->agent_id, $launched->session->id);
    }

    /**
     * @return list<string>
     */
    private function storedTypeKeys(): array
    {
        return array_map(
            fn (FrameRecord $frame) => $frame->reference->typeKey,
            AgentStackRow::query()->authorizedFor($this->target)->sole()->frames->all(),
        );
    }
}
