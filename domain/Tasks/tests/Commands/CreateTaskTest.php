<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Commands;

use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Exceptions\CommandInputInvalid;
use App\Models\Access\User;
use App\Support\ActorContext;
use App\Support\ConnectedProject;
use App\Support\ServedEnvironment;
use App\Values\OwnerAuthority;
use Domain\Tasks\Commands\CreateTask\CreateTaskCommand;
use Domain\Tasks\Enums\TaskStatus;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Tests\TestCase;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TestIds;

/**
 * A user or agent makes a task: it is open at its first revision with its brief and creator; a title at its limit is
 * kept, and an empty title or a title or brief past its limit is refused naming the field and makes nothing.
 */
#[TestsCommand(CreateTaskCommand::class)]
final class CreateTaskTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'tasks',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();
    }

    public function test_a_task_is_open_at_its_first_revision_with_its_brief_and_creator(): void
    {
        $task = Task::query()->findOrFail($this->journal->run(new CreateTaskCommand('Write it', 'Write the page.')));

        $this->assertSame(
            [
                TaskStatus::Open,
                1,
                'Write the page.',
                User::storedType(),
                $this->journal->ownerUser()->id,
            ],
            [
                $task->status,
                $task->revision,
                $task->brief,
                $task->creator_type,
                $task->creator_id,
            ],
        );
    }

    public function test_a_title_at_its_limit_is_kept(): void
    {
        $title = str_repeat('é', Task::TITLE_CHARACTER_LIMIT);

        $taskId = $this->journal->run(new CreateTaskCommand($title, 'Brief'));

        $this->assertSame($title, Task::query()->findOrFail($taskId)->title);
    }

    /**
     * @return iterable<string, array{string, string, string}>
     */
    public static function refusedInput(): iterable
    {
        yield 'a long title' => [
            str_repeat('é', Task::TITLE_CHARACTER_LIMIT + 1),
            'Brief',
            'title',
        ];

        yield 'an empty title' => [
            '',
            'Brief',
            'title',
        ];

        yield 'a long brief' => [
            'Write it',
            str_repeat('é', Task::NOTE_CHARACTER_LIMIT + 1),
            'brief',
        ];
    }

    #[DataProvider('refusedInput')]
    public function test_input_past_its_limit_or_empty_is_refused_naming_the_field(
        string $title,
        string $brief,
        string $field,
    ): void {
        $this->assertThrows(
            fn () => $this->journal->run(new CreateTaskCommand($title, $brief)),
            CommandInputInvalid::class,
            "{$field}:",
        );

        $this->assertSame(0, Task::query()->count());
    }

    public function test_a_task_carries_the_environment_of_the_binding_it_was_made_through(): void
    {
        $research = $this->createThrough('research-environment', 'Review the release');
        $production = $this->createThrough('production-environment', 'Ship the release');
        $here = $this->createHere('Tidy the notes');

        $this->assertSame('research-environment', $research->environment_id);
        $this->assertSame('production-environment', $production->environment_id);
        $this->assertNull($here->environment_id);

        $this->assertSame(
            [$research->id],
            Task::query()->inEnvironments(['research-environment'])->pluck('id')->all(),
        );

        $this->assertSame(3, Task::query()->inEnvironments([])->count());
    }

    private function createHere(string $title): Task
    {
        $this->app->forgetScopedInstances();

        return $this->create($title);
    }

    private function createThrough(string $environmentId, string $title): Task
    {
        $this->app->forgetScopedInstances();
        $this->app->make(ServedEnvironment::class)->connect(new ConnectedProject('shop', '/work/shop', $environmentId));

        return $this->create($title);
    }

    private function create(string $title): Task
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser(TestIds::of(7)),
            new OwnerAuthority('test'),
        );

        $id = $this->app->make(CommandBus::class)->run(new CreateTaskCommand($title, 'What it asks.'));

        return Task::query()->findOrFail($id);
    }
}
