<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Contracts\Actors\ActorAttention;
use App\Contracts\Events\Event;
use App\Enums\Hooks\AnswerType;
use App\Models\Drivers\HookCall;
use App\Providers\DomainEventServiceProvider;
use App\Support\OperationDeadline;
use App\Support\References\StateReference;
use App\Support\References\SubjectReference;
use App\Support\StackTransaction;
use Domain\Rules\RulesDomain;
use Domain\Tasks\Enums\TaskStatus;
use Domain\Tasks\Events\TaskCancelled;
use Domain\Tasks\Events\TaskFinished;
use Domain\Tasks\TasksDomain;
use Illuminate\Contracts\Events\Dispatcher;
use Psr\Log\LoggerInterface;
use Tests\Fixtures\Agents\RecordedAttention;
use Tests\Fixtures\Domains\Tasks\States\TaskWatchDomain;
use Tests\Fixtures\Domains\Tasks\States\TaskWatchLog;
use Tests\Support\CommittedHookStack;
use Tests\Support\DomainBoot;
use Tests\Support\InstallsCommandModules;
use Tests\Support\TestIds;
use Tests\TestCase;

final class TaskWatchDeliveryTest extends TestCase
{
    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(RulesDomain::class, TasksDomain::class);
    }

    use CommittedHookStack {
        setUpCommittedHookStack as private setUpBaseStack;
    }
    use InstallsCommandModules;

    protected function setUpCommittedHookStack(): void
    {
        $this->bootModules(TaskWatchDomain::class);

        new DomainEventServiceProvider($this->app)->boot();
        $this->setUpBaseStack();
    }

    public function test_real_task_events_visit_every_live_watch_from_the_top_and_each_watch_answers_the_stop(): void
    {
        $taskId = TestIds::of(42);
        $this->pushState($this->task(42));
        $this->pushState(new StateReference('tasks.task_watch', new SubjectReference($taskId, 1), ['taskId' => $taskId, 'runNumber' => 1]));
        $this->pushState(new StateReference('tasks.ordinary_task_watch', new SubjectReference($taskId, 2), ['taskId' => $taskId, 'runNumber' => 2]));
        $this->pushState(new StateReference('tasks.task_watch', new SubjectReference($taskId, 3), ['taskId' => $taskId, 'runNumber' => 3]));

        $attention = new RecordedAttention();
        $this->app->instance(ActorAttention::class, $attention);
        $trace = [];
        $logger = $this->createMock(LoggerInterface::class);
        $logger->method('debug')->willReturnCallback(
            static function (string $message, array $context) use (&$trace): void {
                if ($message === 'Calling a state event method.') {
                    $trace[] = [$context['event'], $context['frame']];
                }
            },
        );
        $this->app->instance(LoggerInterface::class, $logger);

        $this->dispatch(new TaskFinished(TestIds::of(43), TaskStatus::Started, 'entry'));
        $this->assertSame([], $this->app->make(TaskWatchLog::class)->records);
        $this->assertSame([], $attention->wakes);
        $trace = [];

        $this->dispatch(new TaskFinished($taskId, TaskStatus::Started, 'entry'));
        $this->assertSame([], $attention->wakes);
        $this->dispatch(new TaskCancelled($taskId, TaskStatus::Started, 'entry'));

        $actorId = $this->target->agentId;
        $this->assertSame([
            "finished/$taskId/3/$actorId",
            "finished/$taskId/2/$actorId",
            "finished/$taskId/1/$actorId",
            "cancelled/$taskId/3/$actorId",
            "cancelled/$taskId/2/$actorId",
            "cancelled/$taskId/1/$actorId",
        ], $this->app->make(TaskWatchLog::class)->records);
        $this->assertSame([], $attention->wakes);
        $this->assertSame(
            [TaskFinished::class, TaskFinished::class, TaskFinished::class, TaskCancelled::class, TaskCancelled::class, TaskCancelled::class],
            array_column($trace, 0),
        );
        $this->assertSame(array_slice(array_column($trace, 1), 0, 3), array_slice(array_column($trace, 1), 3));

        $this->answerStop('call-1');
        $steps = HookCall::query()->forHookId('call-1')->sole()->steps->steps;
        $this->assertSame(
            [AnswerType::Delegate, AnswerType::Delegate, AnswerType::Delegate, AnswerType::Deny],
            array_column($steps, 'answer'),
        );
        $this->assertSame([1, 1, 1, 0], array_column($steps, 'contextCount'));
    }

    private function dispatch(Event $event): void
    {
        $this->app->make(StackTransaction::class)->runAdmittedForTarget(
            $this->target,
            new OperationDeadline(),
            fn () => $this->app->make(Dispatcher::class)->dispatch($event),
        );
    }
}
