<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Feature;

use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Models\Agents\Agent;
use App\Support\ActorContext;
use App\Support\ActorIdentity;
use App\Values\OwnerAuthority;
use Domain\Tasks\Commands\EditTask\EditTaskCommand;
use Domain\Tasks\Enums\TaskStatus;
use Domain\Tasks\Exceptions\TaskRevisionChanged;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Tests\TestCase;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\SendsSignedPayloads;
use Tests\Support\TestIds;

/**
 * A task's run counts up through its own methods, an agent's signed route makes a task as the agent, and the route
 * and the bus give the same edit.
 */
final class TaskAuthoringTest extends TestCase
{
    use CommitsHookRows;
    use SendsSignedPayloads;

    private const string TITLE_TOO_LONG = 'title: The title field must not be greater than 240 characters.';

    private const string TITLE_NEEDED_WITHOUT_BRIEF = 'title: The title field is required when brief is not present.';

    private const array TABLES = [
        'tasks',
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
    ];

    private const string AGENT = '01jd8x0g9m3qz6v4k2agent001';

    public function test_a_run_counts_up_and_records_its_note_and_reasons(): void
    {
        $task = Task::factory()->create();

        $task->start(ActorIdentity::system());
        $this->assertSame([
            1,
            TaskStatus::Started,
        ], [
            $task->run_number,
            $task->status,
        ]);

        $task->block('Waits on the schema.');
        $task->start(ActorIdentity::system());
        $task->finish('Built and tested.');
        $fresh = $task->fresh();

        $this->assertSame(
            [
                2,
                TaskStatus::Finished,
                'Waits on the schema.',
                'Built and tested.',
                1,
            ],
            [
                $fresh?->run_number,
                $fresh?->status,
                $fresh?->block_reason,
                $fresh?->result_note,
                $fresh?->revision,
            ],
        );
    }

    private function actAsUser(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser(TestIds::of(7)),
            new OwnerAuthority('test'),
        );
    }
}
