<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Core\Actors\ActorContext;
use App\Core\Actors\Exceptions\PersonActorRequired;
use App\Core\Agents\LaunchedAgent;
use App\Core\Agents\LaunchSessions;
use App\Core\Agents\Models\Agent;
use App\Core\Hooks\Decisions\NoSubject;
use App\Core\Hooks\Decisions\StateReference;
use App\Core\Hooks\Events\StateTypesRequested;
use App\Core\Hooks\Exceptions\StackTargetRefused;
use App\Core\Hooks\Exceptions\StackTransactionRequired;
use App\Core\Hooks\Models\AgentStackRow;
use App\Core\Hooks\PersonStacks;
use App\Core\Hooks\StackTransaction;
use App\Core\Hooks\Storage\FrameRecord;
use App\Core\Hooks\Storage\StackTarget;
use Illuminate\Contracts\Events\Dispatcher;
use Tests\Fixtures\Modules\Notes\Listeners\RegisterNoteStates;
use Tests\Support\CommitsHookRows;
use Tests\TestCase;

/**
 * A person pushes a state onto a running agent's stack without an agent context; the agent stays the target.
 */
final class PersonStacksTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['agents', 'agent_sessions', 'launch_credentials', 'agent_stacks', 'hook_calls', 'links'];

    private StackTarget $target;

    protected function setUp(): void
    {
        parent::setUp();

        $this->app->make(Dispatcher::class)->listen(StateTypesRequested::class, RegisterNoteStates::class);
        $this->target = $this->targetOf($this->launch());
    }

    public function test_a_person_pushes_a_state_onto_a_running_agents_stack(): void
    {
        $this->actAs(ActorContext::forPerson(7));

        $this->pushInTransaction($this->target);

        $this->assertSame(['hooks.main_ready', 'notes.writing'], $this->storedTypeKeys());
    }

    public function test_an_agent_cannot_use_the_person_path(): void
    {
        $this->actAs(ActorContext::forAgent($this->target->agentId));

        $this->expectException(PersonActorRequired::class);

        $this->pushInTransaction($this->target);
    }

    public function test_a_guessed_session_is_refused(): void
    {
        $this->actAs(ActorContext::forPerson(7));

        $this->expectException(StackTargetRefused::class);

        $this->pushInTransaction(new StackTarget($this->target->agentId, $this->target->sessionId + 100));
    }

    public function test_a_session_of_another_agent_is_refused(): void
    {
        $other = $this->targetOf($this->launch());
        $this->actAs(ActorContext::forPerson(7));

        $this->expectException(StackTargetRefused::class);

        $this->pushInTransaction(new StackTarget($this->target->agentId, $other->sessionId));
    }

    public function test_the_push_runs_only_inside_a_stack_transaction(): void
    {
        $this->actAs(ActorContext::forPerson(7));

        $this->expectException(StackTransactionRequired::class);

        $this->app->make(PersonStacks::class)->push($this->target, new StateReference('notes.writing', NoSubject::None));
    }

    private function pushInTransaction(StackTarget $target): void
    {
        $this->app->make(StackTransaction::class)->run(
            fn () => $this->app->make(PersonStacks::class)->push($target, new StateReference('notes.writing', NoSubject::None)),
        );
    }

    private function actAs(ActorContext $actor): void
    {
        $this->app->instance(ActorContext::class, $actor);
    }

    private function launch(): LaunchedAgent
    {
        $agent = Agent::query()->create(['name' => 'Test agent', 'role' => 'hooks.main_ready']);

        return $this->app->make(LaunchSessions::class)->launch($agent, 'claude-code');
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
