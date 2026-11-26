<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Commands;

use App\Access\Values\OwnerAuthority;
use App\Actors\Contracts\CurrentActorSetter;
use App\Bus\Contracts\CommandBus;
use App\Bus\Exceptions\CommandInputInvalid;
use App\Bus\Exceptions\CrossProjectWrite;
use App\Models\Access\User;
use App\Models\Projects\Environment;
use App\Projects\ConnectedProject;
use App\Projects\ServedEnvironment;
use App\Support\ActorReference;
use Domain\Tasks\Commands\CreateTask\CreateTaskCommand;
use Domain\Tasks\Enums\TaskStatus;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Tests\TestCase;
use Illuminate\Database\QueryException;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TestIds;
use Tests\Support\TestProjects;

/**
 * A user or agent makes a task of a project, open at its first revision with its brief and creator; a title at its
 * limit is kept, an empty or too long title or brief is refused by field, and another project or its environment is
 * refused.
 */
#[TestsCommand(CreateTaskCommand::class)]
final class CreateTaskTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'tasks',
        'project_environments',
        'projects',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();
    }

    public function test_a_task_is_open_at_its_first_revision_with_its_brief_and_creator(): void
    {
        $task = Task::query()->findOrFail($this->journal->run(new CreateTaskCommand('Write it', 'Write the page.', $this->localId())));

        $this->assertSame(
            [TaskStatus::Open, 1, 'Write the page.', User::storedType(), $this->journal->ownerUser()->id],
            [$task->status, $task->revision, $task->brief, $task->creator_type, $task->creator_id],
        );
    }

    public function test_a_title_at_its_limit_is_kept(): void
    {
        $title = str_repeat('é', Task::TITLE_CHARACTER_LIMIT);

        $taskId = $this->journal->run(new CreateTaskCommand($title, 'Brief', $this->localId()));

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
            fn () => $this->journal->run(new CreateTaskCommand($title, $brief, $this->localId())),
            CommandInputInvalid::class,
            "{$field}:",
        );

        $this->assertSame(0, Task::query()->count());
    }

    public function test_a_task_carries_the_environment_of_the_binding_it_was_made_through(): void
    {
        $research = Environment::create(TestProjects::local(), 'Research')->id;
        $production = Environment::create(TestProjects::local(), 'Production')->id;
        $reviewed = $this->createThrough($research, 'Review the release');
        $shipped = $this->createThrough($production, 'Ship the release');
        $here = $this->createHere('Tidy the notes');

        $this->assertSame($research, $reviewed->environment_id);
        $this->assertSame($production, $shipped->environment_id);
        $this->assertNull($here->environment_id);
        $this->assertSame([$reviewed->id], Task::query()->inEnvironments([$research])->pluck('id')->all());
        $this->assertSame(3, Task::query()->inEnvironments([])->count());
    }

    public function test_a_task_of_an_agent_belongs_to_its_project_and_is_missing_under_another(): void
    {
        $this->journal->project('Shop')->agent('Cy', 'main-agent', 'Shop')->agent('Ada')->actAs('Cy');
        $shop = $this->journal->projectCalled('Shop')->id;

        $taskId = $this->journal->run(new CreateTaskCommand('Stock it', 'The shelves are full.', $shop));

        $this->assertSame($shop, Task::query()->findOrFail($taskId)->project_id);
        $this->journal->actAs('Ada');
        $this->assertNull(Task::query()->find($taskId));
    }

    public function test_an_agent_naming_another_project_is_refused_and_makes_nothing(): void
    {
        $this->journal->project('Shop')->agent('Ada')->actAs('Ada');

        $this->journal->assertRefused(CrossProjectWrite::class, fn () => $this->journal->run(
            new CreateTaskCommand('Elsewhere', 'Not mine.', $this->journal->projectCalled('Shop')->id),
        ));

        $this->assertSame(0, Task::query()->acrossProjects()->count());
    }

    public function test_the_environment_of_another_project_is_refused_and_nothing_is_saved(): void
    {
        $this->journal->project('Shop');
        $shopEnvironment = Environment::create($this->journal->projectCalled('Shop'), 'Shop work')->id;

        $this->assertThrows(fn () => $this->createThrough($shopEnvironment, 'Crossed'), QueryException::class);
        $this->assertSame(0, Task::query()->count());
    }

    private function localId(): string
    {
        return TestProjects::local()->id;
    }

    private function createHere(string $title): Task
    {
        $this->app->forgetScopedInstances();

        return $this->create($title);
    }

    private function createThrough(string $environmentId, string $title): Task
    {
        $this->app->forgetScopedInstances();
        $this->app->make(ServedEnvironment::class)->connect(new ConnectedProject('/work/shop', $environmentId));

        return $this->create($title);
    }

    private function create(string $title): Task
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorReference::forUser(TestIds::of(7)),
            new OwnerAuthority('test'),
        );

        $id = $this->app->make(CommandBus::class)->run(
            new CreateTaskCommand($title, 'What it asks.', $this->localId()),
        );

        return Task::query()->findOrFail($id);
    }
}
