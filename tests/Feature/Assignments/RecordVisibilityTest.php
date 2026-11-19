<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Agents\Models\Agent;
use App\Assignments\Contracts\RecordVisibility;
use App\Records\Support\RecordIdentity;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Tasks\Models\Task;
use Tests\Fixtures\Modules\Notes\Models\Note;
use Tests\Support\CommitsHookRows;
use Tests\Support\InstallsNotesModule;
use Tests\Support\StartsAgentRequests;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * Core answers whether one record is visible to this request's actor through its owner's own visibility read: a
 * missing, a hidden and an unregistered record all answer no.
 */
final class RecordVisibilityTest extends TestCase
{
    use CommitsHookRows;
    use InstallsNotesModule;
    use StartsAgentRequests;

    private const array TABLES = ['tasks', 'users', 'agents', 'number_groups'];

    private Agent $writer;

    private Agent $resolver;

    private Note $note;

    protected function setUp(): void
    {
        parent::setUp();

        $this->createNotesTables();
        $this->installNotesModule();
        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->writer = Agent::named('Writer', 'main-agent');
        $this->resolver = Agent::named('Reader', 'main-agent');
        $this->note = new Note(['text' => 'Check the lock order']);
        $this->note->saveFor($this->writer->id);
    }

    protected function tearDown(): void
    {
        $this->dropNotesTables();

        parent::tearDown();
    }

    public function test_a_visible_task_answers_yes_and_a_missing_one_no_under_two_actors(): void
    {
        $task = Task::factory()->create(['title' => 'Write the reader']);

        foreach ([$this->writer, $this->resolver] as $agent) {
            $this->startRequestAs($agent->id, TestIds::of(50));
            $visibility = $this->app->make(RecordVisibility::class);

            $this->assertTrue($visibility->isVisible($task->assignmentIdentity()));
            $this->assertFalse($visibility->isVisible(new RecordIdentity(Task::LINK_TYPE, TestIds::of(999999))));
        }
    }

    public function test_a_hidden_record_answers_no_to_one_actor_and_yes_to_its_owner(): void
    {
        $this->startRequestAs($this->resolver->id, TestIds::of(50));
        $this->assertFalse($this->app->make(RecordVisibility::class)->isVisible($this->note->assignmentIdentity()));

        $this->startRequestAs($this->writer->id, TestIds::of(51));
        $this->assertTrue($this->app->make(RecordVisibility::class)->isVisible($this->note->assignmentIdentity()));
    }

    public function test_an_unregistered_type_answers_no(): void
    {
        $this->startRequestAs($this->writer->id, TestIds::of(50));

        $this->assertFalse($this->app->make(RecordVisibility::class)->isVisible(TestActors::record('ledger.entry', 1)));
    }
}
