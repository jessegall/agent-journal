<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\AgentRequests\Support\SignedCall;
use App\Agents\Actions\StartSessions;
use App\Agents\Models\Agent;
use App\Agents\Support\AgentContext;
use App\Agents\Support\StackTarget;
use App\Agents\Support\StartedAgent;
use App\Hooks\Actions\AgentStacks;
use App\Hooks\Actions\EngineStacks;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\SubjectReference;
use App\Hooks\Events\StateTypesRequested;
use App\Hooks\Models\AgentStackRow;
use App\Hooks\States\AgentState;
use App\Hooks\Support\StackTransaction;
use Carbon\CarbonImmutable;
use Closure;
use Illuminate\Support\Facades\Event;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Fixtures\Hooks\ClosureStateLoader;
use Tests\Fixtures\Hooks\Ticks\TickingLoader;
use Tests\Fixtures\Hooks\Ticks\TickingState;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsAsEngine;
use Tests\Support\TestStartAuthority;
use Tests\TestCase;

/**
 * A stack records whether it holds a frame of a ticking type every time its frames are saved, and the engine reads
 * only active, flagged stacks whose session still runs.
 */
final class TickingStackFlagTest extends TestCase
{
    use CommitsHookRows;
    use RunsAsEngine;

    private const array TABLES = ['agents', 'agent_sessions', 'start_tokens', 'agent_stacks', 'hook_calls'];

    /**
     * @var list<string> subjects of ticking frames whose work is done
     */
    private array $finished = [];

    protected function setUp(): void
    {
        parent::setUp();

        Event::listen(StateTypesRequested::class, function (StateTypesRequested $event): void {
            $event->registry->register('test.ticking', new TickingLoader(
                fn (StateReference $reference): AgentState => TickingState::of($reference, $this->finished),
            ));
            $event->registry->register(
                'test.plain',
                new ClosureStateLoader(TickingState::class, fn () => new TickingState(false)),
            );
        });
    }

    public function test_pushing_a_ticking_frame_sets_the_flag_and_removing_the_last_one_clears_it(): void
    {
        $started = $this->start();
        $this->assertFalse($this->stackOf($started)->has_ticking_frames);

        $this->push($started, 'test.plain', 'P');
        $this->assertFalse($this->stackOf($started)->has_ticking_frames);

        $this->push($started, 'test.ticking', 'T');
        $this->assertTrue($this->stackOf($started)->has_ticking_frames);

        $this->finished = ['T'];
        $this->asEngineFor(
            $this->targetOf($started),
            fn () => $this->app->make(EngineStacks::class)->popExposed($this->targetOf($started)),
        );
        $this->assertFalse($this->stackOf($started)->has_ticking_frames);
    }

    public function test_the_engine_reads_only_active_flagged_stacks_whose_session_runs(): void
    {
        $ticking = $this->start();
        $plain = $this->start();
        $ended = $this->start();
        $closed = $this->start();
        $this->push($ticking, 'test.ticking', 'T1');
        $this->push($plain, 'test.plain', 'P');
        $this->push($ended, 'test.ticking', 'T2');
        $this->push($closed, 'test.ticking', 'T3');
        $ended->session->endAt(CarbonImmutable::now());
        $this->stackOf($closed)->closeAt(CarbonImmutable::now());

        $this->assertSame(
            [$ticking->session->id],
            AgentStackRow::query()->tickingOpen()->readLimit(10)->pluck('session_id')->all(),
        );
    }

    private function start(): StartedAgent
    {
        return $this->app->make(StartSessions::class)->start(
            Agent::named('Test agent', 'main-agent'),
            TestSelections::of('claude-code'),
            TestSelections::requestId(),
        );
    }

    private function push(StartedAgent $started, string $typeKey, string $subject): void
    {
        $this->as(
            $started,
            fn () => $this->app->make(AgentStacks::class)->push(
                $this->targetOf($started),
                new StateReference($typeKey, new SubjectReference($subject, 1)),
            ),
        );
    }

    /**
     * @param  Closure(): mixed  $work
     */
    private function as(StartedAgent $started, Closure $work): void
    {
        $this->app->forgetScopedInstances();
        $this->app->instance(
            AgentContext::class,
            new AgentContext(
                $started->session->agent_id,
                $started->session->id,
                new SignedCall('setup', CarbonImmutable::now(), hash('sha256', 'setup')),
                null,
            ),
        );
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forAgent($started->session->agent_id),
            TestStartAuthority::forAgent($started->session->agent_id),
        );
        $this->app->make(StackTransaction::class)->run($work);
    }

    private function stackOf(StartedAgent $started): AgentStackRow
    {
        return AgentStackRow::query()->authorizedFor($this->targetOf($started))->sole();
    }

    private function targetOf(StartedAgent $started): StackTarget
    {
        return new StackTarget($started->session->agent_id, $started->session->id);
    }
}
