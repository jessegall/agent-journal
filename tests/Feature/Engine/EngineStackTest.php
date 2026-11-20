<?php

declare(strict_types=1);

namespace Tests\Feature\Engine;

use App\Agents\Actions\StartSessions;
use App\Agents\Exceptions\StackTargetRefused;
use App\Agents\Models\Agent;
use App\Agents\Support\StackTarget;
use App\Agents\Support\StartedAgent;
use App\Engine\Exceptions\EngineAccessRefused;
use App\Hooks\Actions\EngineStacks;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\SubjectReference;
use App\Hooks\Events\StateTypesRequested;
use App\Hooks\Models\AgentStackRow;
use App\Hooks\Storage\FrameRecord;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Event;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Fixtures\Hooks\Lifecycle\LifecycleLog;
use Tests\Fixtures\Hooks\Lifecycle\RecordingStateLoader;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsAsEngine;
use Tests\TestCase;

/**
 * The engine changes a stack only as a handler would, inside a transaction and only on the target its grant covers:
 * it pushes through the shared push, which enters the frame once, is refused another target or an ended session, and
 * may settle the finished frames of its own target.
 */
final class EngineStackTest extends TestCase
{
    use CommitsHookRows;
    use RunsAsEngine;

    private const array TABLES = ['agents', 'agent_sessions', 'start_tokens', 'agent_stacks', 'hook_calls'];

    private LifecycleLog $log;

    private RecordingStateLoader $tasks;

    protected function setUp(): void
    {
        parent::setUp();

        $this->log = new LifecycleLog();
        $this->tasks = new RecordingStateLoader($this->log);
        Event::listen(
            StateTypesRequested::class,
            fn (StateTypesRequested $event) => $event->registry->register('test.tasks', $this->tasks),
        );
    }

    public function test_the_engine_pushes_onto_its_granted_target_and_the_frame_enters_once(): void
    {
        $started = $this->start();

        $this->asEngineFor(
            $this->targetOf($started),
            fn () => $this->app->make(EngineStacks::class)->push($this->targetOf($started), $this->task('A')),
        );

        $this->assertSame(['enter:A'], $this->log->calls);
        $this->assertSame(['A'], $this->storedSubjects($started));
    }

    public function test_the_engine_is_refused_a_target_its_grant_does_not_cover(): void
    {
        $granted = $this->start();
        $other = $this->start();

        $this->assertThrows(
            fn () => $this->asEngineFor(
                $this->targetOf($granted),
                fn () => $this->app->make(EngineStacks::class)->push($this->targetOf($other), $this->task('B')),
            ),
            EngineAccessRefused::class,
        );

        $this->assertSame([], $this->storedSubjects($other));
    }

    public function test_a_push_onto_an_ended_sessions_stack_is_refused(): void
    {
        $started = $this->start();
        $started->session->endAt(CarbonImmutable::now());

        $this->assertThrows(
            fn () => $this->asEngineFor(
                $this->targetOf($started),
                fn () => $this->app->make(EngineStacks::class)->push($this->targetOf($started), $this->task('A')),
            ),
            StackTargetRefused::class,
        );

        $this->assertSame([], $this->log->calls);
    }

    public function test_the_engine_settles_the_finished_frames_of_its_granted_target(): void
    {
        $started = $this->start();
        $target = $this->targetOf($started);
        $this->asEngineFor($target, fn () => $this->app->make(EngineStacks::class)->push($target, $this->task('A')));
        $this->tasks->finished = ['A'];

        $this->asEngineFor($target, fn () => $this->app->make(EngineStacks::class)->popExposed($target));

        $this->assertSame(['enter:A', 'exit:A'], $this->log->calls);
        $this->assertSame([], $this->storedSubjects($started));
    }

    private function targetOf(StartedAgent $started): StackTarget
    {
        return new StackTarget($started->session->agent_id, $started->session->id);
    }

    private function task(string $subject): StateReference
    {
        return new StateReference('test.tasks', new SubjectReference($subject, 1));
    }

    /**
     * @return list<string>
     */
    private function storedSubjects(StartedAgent $started): array
    {
        $frames = array_slice(
            AgentStackRow::query()->authorizedFor($this->targetOf($started))->sole()->frames->all(),
            1,
        );

        return array_map(
            fn (
                FrameRecord $frame,
            ) => $frame->reference->subject instanceof SubjectReference ? $frame->reference->subject->id : '',
            $frames,
        );
    }

    private function start(): StartedAgent
    {
        return $this->app->make(StartSessions::class)->start(
            Agent::create('Test agent', 'main-agent'),
            TestSelections::of('claude-code'),
            TestSelections::requestId(),
        );
    }
}
