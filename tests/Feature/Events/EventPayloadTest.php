<?php

declare(strict_types=1);

namespace Tests\Feature\Events;

use App\Actors\Support\ActorContext;
use App\Bus\Contracts\CommandBus;
use App\Reflection\Support\DeclaredType;
use App\Reflection\Support\ReflectedMethod;
use App\Reflection\Support\Reflector;
use Closure;
use Domain\Plans\Api\Events\PlanCancelled;
use Domain\Plans\Api\Events\PlanFinished;
use Domain\Plans\Api\Events\PlanStarted;
use Domain\Plans\Commands\CancelPlan;
use Domain\Plans\Commands\FinishPlan;
use Domain\Plans\Commands\StartPlan;
use Domain\Plans\Models\Plan;
use Domain\Tasks\Api\Events\TaskBlocked;
use Domain\Tasks\Api\Events\TaskCancelled;
use Domain\Tasks\Api\Events\TaskFinished;
use Domain\Tasks\Commands\BlockTask;
use Domain\Tasks\Commands\CancelTask;
use Domain\Tasks\Commands\FinishTask;
use Domain\Tasks\Commands\StartTask;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\Events\TaskStarted;
use Domain\Tasks\Models\Task;
use Illuminate\Contracts\Container\Container;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Events\Dispatcher;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Support\ActsAsOwner;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Every fact of doc 70 table 1 keeps its published shape through plan 40 (doc 67 sections 12 and 21): its fields and
 * their types, actor fields included, its delivery after the commit or at once, and a payload a queue can carry. The
 * Tasks and Plans facts are also sent through their real commands, a repeat included. Each migration slice keeps its
 * rows passing unchanged.
 */
#[TimeLimit(seconds: 20, reason: 'The sent facts commit through the bus and empty their tables around each test.')]
final class EventPayloadTest extends TestCase
{
    use ActsAsOwner;
    use CommitsHookRows;
    use StartsAgentRequests;

    private const array TABLES = [
        'users',
        'tasks',
        'task_runs',
        'plans',
        'agents',
        'agent_sessions',
        'agent_stacks',
        'assignments',
        'claim_authorizations',
        'command_receipts',
    ];

    /**
     * The kinds a fact's payload may not hold anywhere inside it.
     */
    private const array UNQUEUEABLE = [Model::class, Container::class, Closure::class];

    /**
     * @return iterable<string, array{class-string, bool, array<string, string>}>
     */
    public static function facts(): iterable
    {
        foreach (EventPayloads::facts() as $event => $shape) {
            $name = class_basename($event).' keeps its fields and its delivery';

            yield $name => [$event, $shape['afterCommit'], $shape['fields']];
        }
    }

    /**
     * @param  class-string  $event
     * @param  array<string, string>  $fields
     */
    #[DataProvider('facts')]
    public function test_a_fact_keeps_its_published_shape(string $event, bool $afterCommit, array $fields): void
    {
        $declaration = Reflector::of($event);
        $declared = [];
        $parameters = $declaration->constructor()
            ->map(fn (ReflectedMethod $constructor) => $constructor->parameters())
            ->getOrElse([]);

        foreach ($parameters as $parameter) {
            $declared[$parameter->name()] = $parameter->type()
                ->map(fn (DeclaredType $type) => $type->text)
                ->getOrElse('');
        }

        $this->assertSame($fields, $declared);
        $this->assertSame($afterCommit, $declaration->implements(ShouldDispatchAfterCommit::class));
        $this->assertSame([], $this->unqueueableTypesIn($event, []));
    }

    public function test_requests_and_projections_are_named_and_skipped(): void
    {
        $this->assertSame(
            ['request', 'projection'],
            array_values(array_unique(array_values(EventPayloads::skipped()))),
        );
        $this->assertSame([], array_intersect_key(EventPayloads::skipped(), EventPayloads::facts()));
    }

    public function test_starting_a_task_sends_task_started_with_the_starter_each_time_it_is_started(): void
    {
        $task = Task::factory()->create();
        $sent = $this->recordedSends();

        $this->runAsOwner(new StartTask($task->id));
        $this->runAsOwner(new StartTask($task->id));

        $classes = array_map(fn (object $event) => $event::class, $sent());

        $this->assertSame([TaskStarted::class, TaskStarted::class], $classes);
        $this->assertSame($this->owner->id, $sent()[0]->actor->id);
        $this->assertEquals($sent()[0], unserialize(serialize($sent()[0])));
    }

    public function test_finishing_blocking_and_cancelling_a_task_each_send_its_fact_once_after_the_commit(): void
    {
        $finished = Task::factory()->create();
        $blocked = Task::factory()->create();
        $cancelled = Task::factory()->create();
        $this->runAsOwner(new StartTask($finished->id));
        $this->runAsOwner(new StartTask($blocked->id));
        $sent = $this->recordedSends();

        $this->runAsOwner(new FinishTask($finished->id, 1, 'Done.'));
        $this->runAsOwner(new BlockTask($blocked->id, 1, 'Waits.'));
        $this->runAsOwner(new CancelTask($cancelled->id, 'Dropped.'));

        $this->assertEquals(
            [
                new TaskFinished($finished->id, TaskState::Started),
                new TaskBlocked($blocked->id, TaskState::Started),
                new TaskCancelled($cancelled->id, TaskState::Open),
            ],
            $sent(),
        );
    }

    public function test_a_plan_start_sends_plan_started_once_with_its_starter_and_a_repeat_sends_nothing(): void
    {
        $plan = Plan::factory()->create();
        $sent = $this->recordedSends();

        $this->runAsOwner(new StartPlan($plan->id));
        $this->runAsOwner(new StartPlan($plan->id));

        $this->assertEquals([new PlanStarted($plan->id, ActorContext::forUser($this->owner->id))], $sent());
    }

    public function test_finishing_and_cancelling_a_plan_send_their_fact_with_the_actor(): void
    {
        $finished = Plan::factory()->create();
        $cancelled = Plan::factory()->create();
        $this->runAsOwner(new StartPlan($finished->id));
        $sent = $this->recordedSends();

        $this->runAsOwner(new FinishPlan($finished->id, $finished->refresh()->revision, 'Done.'));
        $this->runAsOwner(new CancelPlan($cancelled->id, $cancelled->refresh()->revision, 'Dropped.'));

        $owner = ActorContext::forUser($this->owner->id);
        $this->assertEquals(
            [new PlanFinished($finished->id, $owner), new PlanCancelled($cancelled->id, $owner)],
            $sent(),
        );
    }

    /**
     * The facts of Tasks and Plans the commands send from now on, in the order they reach their listeners.
     *
     * @return Closure(): list<object>
     */
    private function recordedSends(): Closure
    {
        $sent = [];
        $events = [
            TaskStarted::class,
            TaskFinished::class,
            TaskBlocked::class,
            TaskCancelled::class,
            PlanStarted::class,
            PlanFinished::class,
            PlanCancelled::class,
        ];

        foreach ($events as $event) {
            $this->app->make(Dispatcher::class)->listen($event, function (object $fact) use (&$sent): void {
                $sent[] = $fact;
            });
        }

        return function () use (&$sent): array {
            return $sent;
        };
    }

    private function runAsOwner(object $command): void
    {
        $this->startUserRequestAs($this->owner->id);
        $this->app->make(CommandBus::class)->run($command);
    }

    /**
     * The classes inside the type, its value objects' properties followed, that a queued payload cannot carry.
     *
     * @param  list<string>  $seen
     * @return list<string>
     */
    private function unqueueableTypesIn(string $type, array $seen): array
    {
        $declaration = Reflector::find($type)->filter(fn (Reflector $found) => $found->isClass());

        if (in_array($type, $seen, true) || $declaration->isEmpty()) {
            return [];
        }

        $found = array_values(array_filter(self::UNQUEUEABLE, fn (string $kind) => $declaration->get()->is($kind)));

        if ($found !== [] || ! (str_starts_with($type, 'App\\') || str_starts_with($type, 'Domain\\'))) {
            return $found === [] ? [] : [$type];
        }

        $inside = [];

        foreach ($declaration->get()->properties() as $property) {
            $propertyType = $property->type()
                ->filter(fn (DeclaredType $declared) => $declared->isNamed() && ! $declared->isBuiltin());

            if ($propertyType->isDefined()) {
                array_push($inside, ...$this->unqueueableTypesIn($propertyType->get()->name(), [...$seen, $type]));
            }
        }

        return $inside;
    }
}
