<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Actors\Contracts\ActorAttention;
use App\Actors\Contracts\PolicyCatalogue;
use App\Bus\Support\OperationDeadline;
use App\Contracts\Event;
use App\Domains\Providers\DomainEventServiceProvider;
use App\Domains\Support\DomainRegistry;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\SubjectReference;
use App\Hooks\Enums\AnswerType;
use App\Hooks\Enums\SelectionReason;
use App\Hooks\Models\HookCall;
use App\Hooks\Support\StackTransaction;
use Domain\Tasks\Api\Events\TaskCancelled;
use Domain\Tasks\Api\Events\TaskFinished;
use Illuminate\Contracts\Events\Dispatcher;
use Psr\Log\LoggerInterface;
use Tests\Fixtures\Agents\RecordedAttention;
use Tests\Fixtures\Domains\Tasks\States\TaskWatchDomain;
use Tests\Fixtures\Domains\Tasks\States\TaskWatchLog;
use Tests\Support\CommittedHookStack;
use Tests\Support\InstallsCommandModules;
use Tests\Support\TestIds;
use Tests\TestCase;

final class TaskWatchDeliveryTest extends TestCase
{
    use CommittedHookStack {
        setUpCommittedHookStack as private setUpBaseStack;
    }
    use InstallsCommandModules;

    protected function setUpCommittedHookStack(): void
    {
        $this->bootModules(TaskWatchDomain::class);
        $domain = $this->app->make(DomainRegistry::class)->get('States');
        $catalogue = $this->app->make(PolicyCatalogue::class);

        foreach ($domain->policies() as $policy) {
            $catalogue->register($domain->name, $policy);
        }

        new DomainEventServiceProvider($this->app)->boot();
        $this->setUpBaseStack();
    }

    public function test_real_task_events_visit_the_live_watches_and_keep_context_for_the_stop(): void
    {
        $taskId = TestIds::of(42);
        $this->pushState($this->task(42));
        $this->pushState(new StateReference('states.task_watch', new SubjectReference($taskId, 1)));
        $this->pushState(new StateReference('states.ordinary_task_watch', new SubjectReference($taskId, 2)));
        $this->pushState(new StateReference('states.task_watch', new SubjectReference($taskId, 3)));

        $attention = new RecordedAttention();
        $this->app->instance(ActorAttention::class, $attention);
        $trace = [];
        $logger = $this->createMock(LoggerInterface::class);
        $logger->expects($this->exactly(4))->method('debug')->willReturnCallback(
            static function (string $message, array $context) use (&$trace): void {
                if ($message === 'Calling a state event method.') {
                    $trace[] = [$context['event'], $context['selection'], $context['frame']];
                }
            },
        );
        $this->app->instance(LoggerInterface::class, $logger);

        $dispatcher = $this->app->make(Dispatcher::class);
        $dispatcher->dispatch(new TaskFinished($taskId));
        $this->dispatch(new TaskFinished(TestIds::of(43)));
        $this->assertSame([], $this->app->make(TaskWatchLog::class)->records);
        $this->assertSame([], $attention->wakes);
        $trace = [];

        $this->dispatch(new TaskFinished($taskId));
        $this->assertSame([], $attention->wakes);
        $this->dispatch(new TaskCancelled($taskId));

        $actorId = $this->target->agentId;
        $this->assertSame([
            "finished/$taskId/3/$actorId",
            "cancelled/$taskId/3/$actorId",
            "cancelled/$taskId/1/$actorId",
        ], $this->app->make(TaskWatchLog::class)->records);
        $this->assertCount(1, $attention->wakes);
        $this->assertEquals($this->target->actorIdentity(), $attention->wakes[0][0]);
        $this->assertSame([
            [TaskFinished::class, SelectionReason::FirstMatch->value],
            [TaskCancelled::class, SelectionReason::FirstMatch->value],
            [TaskCancelled::class, SelectionReason::StackWide->value],
        ], array_map(fn (array $entry) => array_slice($entry, 0, 2), $trace));
        $this->assertSame($trace[0][2], $trace[1][2]);
        $this->assertNotSame($trace[1][2], $trace[2][2]);

        $stdout = $this->answerStop('call-1');
        $this->assertStringContainsString(
            'Watch 3 saw the task finish.\nWatch 3 saw the task cancelled.\n'
                .'Watch 1 saw the task cancelled.\nWatch 3 is active.',
            $stdout,
        );
        $steps = HookCall::query()->forHookId('call-1')->sole()->steps->steps;
        $this->assertSame([AnswerType::Allow, AnswerType::Deny], array_column($steps, 'answer'));
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
