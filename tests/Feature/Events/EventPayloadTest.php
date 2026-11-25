<?php

declare(strict_types=1);

namespace Tests\Feature\Events;

use App\Contracts\Asks\AnsweredAtOnce;
use App\Contracts\Bus\CommandBus;
use App\Support\DeclaredType;
use App\Support\ReflectedMethod;
use App\Support\ReflectedType;
use Closure;
use Domain\Plans\Events\PlanCancelled;
use Domain\Plans\Events\PlanFinished;
use Domain\Plans\Events\PlanStarted;
use Domain\Plans\PlansDomain;
use Domain\Tasks\Commands\StartTask\StartTaskCommand;
use Domain\Tasks\Events\TaskBlocked;
use Domain\Tasks\Events\TaskCancelled;
use Domain\Tasks\Events\TaskFinished;
use Domain\Tasks\Events\TaskStarted;
use Domain\Tasks\Models\Task;
use Domain\Tasks\TasksDomain;
use Illuminate\Contracts\Container\Container;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Events\Dispatcher;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Support\ActsAsOwner;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Every published fact keeps its shape: its fields and
 * their types, actor fields included, its delivery after the commit or at once, and a payload a queue can carry. The
 * Tasks and Plans facts are also sent through their real commands, a repeat included. Each migration slice keeps its
 * rows passing unchanged.
 */
#[TimeLimit(seconds: 20, reason: 'The sent facts commit through the bus and empty their tables around each test.')]
final class EventPayloadTest extends TestCase
{
    use ActsAsOwner;
    use CommitsHookRows;

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
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(PlansDomain::class, TasksDomain::class);
    }

    /**
     * The kinds a fact's payload may not hold anywhere inside it.
     */
    private const array UNQUEUEABLE = [Model::class, Container::class, Closure::class];

    /**
     * @return iterable<string, array{class-string, array<string, string>}>
     */
    public static function facts(): iterable
    {
        foreach (EventPayloads::facts() as $event => $shape) {
            $name = class_basename($event).' keeps its fields';

            yield $name => [$event, $shape['fields']];
        }
    }

    /**
     * @param  class-string  $event
     * @param  array<string, string>  $fields
     */
    #[DataProvider('facts')]
    public function test_a_fact_keeps_its_published_shape(string $event, array $fields): void
    {
        $declaration = ReflectedType::of($event);
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
        // A published fact is heard after its command commits, never as a question answered at once.
        $this->assertFalse($declaration->implements(AnsweredAtOnce::class));
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

        $this->runAsOwner(new StartTaskCommand($task->id));
        $this->runAsOwner(new StartTaskCommand($task->id));

        $classes = array_map(fn (object $event) => $event::class, $sent());

        $this->assertSame([TaskStarted::class, TaskStarted::class], $classes);
        $this->assertSame($this->owner->id, $sent()[0]->actor->id);
        $this->assertEquals($sent()[0], unserialize(serialize($sent()[0])));
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
        $this->journal->actAsUserId($this->owner->id);
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
        $declaration = ReflectedType::find($type)->filter(fn (ReflectedType $found) => $found->isClass());

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
