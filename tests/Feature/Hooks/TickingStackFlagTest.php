<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Contracts\Actors\CurrentActorSetter;
use App\Events\Hooks\StateTypesRequested;
use App\Models\Agents\AgentStackRow;
use App\Support\ActorReference;
use App\Support\AgentContext;
use App\Support\AgentStacks;
use App\Support\EngineStacks;
use App\Support\References\StateReference;
use App\Support\References\SubjectReference;
use App\Support\SignedCall;
use App\Support\StackTransaction;
use App\Support\StartedAgent;
use App\Support\StartSessions;
use App\Support\StateLoading\RegisteredStateType;
use App\Values\StackTarget;
use Carbon\CarbonImmutable;
use Closure;
use Illuminate\Support\Facades\Event;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Fixtures\Hooks\Stacks\FinishableState;
use Tests\Fixtures\Hooks\Stacks\FinishedSubjects;
use Tests\Fixtures\Hooks\Ticks\ScriptedOccurrenceGuard;
use Tests\Fixtures\Hooks\Ticks\TickState;
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

    private const array TABLES = ['agents', 'agent_sessions', 'session_tokens', 'agent_stacks', 'hook_calls'];

    private FinishedSubjects $finished;

    private int $startCount = 0;

    protected function setUp(): void
    {
        parent::setUp();

        $this->finished = new FinishedSubjects();
        $this->app->instance(FinishedSubjects::class, $this->finished);
        $this->app->instance(ScriptedOccurrenceGuard::class, new ScriptedOccurrenceGuard());
        Event::listen(StateTypesRequested::class, function (StateTypesRequested $event): void {
            $event->registry->register(RegisteredStateType::named('test.ticking', TickState::class));
            $event->registry->register(RegisteredStateType::named('test.plain', FinishableState::class));
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

        $this->finished->finished = ['T'];
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
            AgentStackRow::query()->tickingOpen()->limit(10)->pluck('session_id')->all(),
        );
    }

    private function start(): StartedAgent
    {
        return $this->app->make(StartSessions::class)->start(
            $this->journal->idleAgent('Test agent '.++$this->startCount, 'main-agent')->agentCalled('Test agent '.$this->startCount),
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
                new StateReference($typeKey, new SubjectReference($subject, 1), ['subject' => $subject]),
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
            ActorReference::forAgent($started->session->agent_id),
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
