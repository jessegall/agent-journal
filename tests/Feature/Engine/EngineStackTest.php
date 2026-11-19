<?php

declare(strict_types=1);

namespace Tests\Feature\Engine;

use App\Agents\Actions\LaunchSessions;
use App\Agents\Enums\AgentRole;
use App\Agents\Exceptions\StackTargetRefused;
use App\Agents\Models\Agent;
use App\Agents\Support\LaunchedAgent;
use App\Agents\Support\StackTarget;
use App\Engine\Exceptions\EngineAccessRefused;
use App\Hooks\Contracts\EngineStack;
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

    private const array TABLES = ['agents', 'agent_sessions', 'launch_credentials', 'agent_stacks', 'hook_calls'];

    private LifecycleLog $log;

    private RecordingStateLoader $tasks;

    protected function setUp(): void
    {
        parent::setUp();

        $this->log = new LifecycleLog();
        $this->tasks = new RecordingStateLoader($this->log);
        Event::listen(StateTypesRequested::class, fn (StateTypesRequested $event) => $event->registry->register('test.tasks', $this->tasks));
    }

    public function test_the_engine_pushes_onto_its_granted_target_and_the_frame_enters_once(): void
    {
        $launched = $this->launch();

        $this->asEngineFor($this->targetOf($launched), fn () => $this->app->make(EngineStack::class)->push($this->targetOf($launched), $this->task('A')));

        $this->assertSame(['enter:A'], $this->log->calls);
        $this->assertSame(['A'], $this->storedSubjects($launched));
    }

    public function test_the_engine_is_refused_a_target_its_grant_does_not_cover(): void
    {
        $granted = $this->launch();
        $other = $this->launch();

        $this->assertThrows(fn () => $this->asEngineFor($this->targetOf($granted), fn () => $this->app->make(EngineStack::class)->push($this->targetOf($other), $this->task('B'))), EngineAccessRefused::class);

        $this->assertSame([], $this->storedSubjects($other));
    }

    public function test_a_push_onto_an_ended_sessions_stack_is_refused(): void
    {
        $launched = $this->launch();
        $launched->session->endAt(CarbonImmutable::now());

        $this->assertThrows(fn () => $this->asEngineFor($this->targetOf($launched), fn () => $this->app->make(EngineStack::class)->push($this->targetOf($launched), $this->task('A'))), StackTargetRefused::class);

        $this->assertSame([], $this->log->calls);
    }

    public function test_the_engine_settles_the_finished_frames_of_its_granted_target(): void
    {
        $launched = $this->launch();
        $target = $this->targetOf($launched);
        $this->asEngineFor($target, fn () => $this->app->make(EngineStack::class)->push($target, $this->task('A')));
        $this->tasks->finished = ['A'];

        $this->asEngineFor($target, fn () => $this->app->make(EngineStack::class)->popExposed($target));

        $this->assertSame(['enter:A', 'exit:A'], $this->log->calls);
        $this->assertSame([], $this->storedSubjects($launched));
    }

    private function targetOf(LaunchedAgent $launched): StackTarget
    {
        return new StackTarget($launched->session->agent_id, $launched->session->id);
    }

    private function task(string $subject): StateReference
    {
        return new StateReference('test.tasks', new SubjectReference($subject, 1));
    }

    /**
     * @return list<string>
     */
    private function storedSubjects(LaunchedAgent $launched): array
    {
        $frames = array_slice(AgentStackRow::query()->authorizedFor($this->targetOf($launched))->sole()->frames->all(), 1);

        return array_map(fn (FrameRecord $frame) => $frame->reference->subject instanceof SubjectReference ? $frame->reference->subject->id : '', $frames);
    }

    private function launch(): LaunchedAgent
    {
        return $this->app->make(LaunchSessions::class)->launch(Agent::named('Test agent', AgentRole::MainAgent), TestSelections::of('claude-code'), TestSelections::requestId());
    }
}
