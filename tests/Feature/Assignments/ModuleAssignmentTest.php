<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Commands\RetireAgent\RetireAgentCommand;
use App\Contracts\AssignmentResolver;
use App\Contracts\CommandBus;
use App\Exceptions\ActorContextMissing;
use App\Exceptions\AssignmentTypeUnavailable;
use App\Exceptions\RecordUnavailable;
use App\Models\Agent;
use App\Models\AssignmentRecord;
use App\Support\AssigneeIdentity;
use App\Support\RecordIdentity;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Illuminate\Support\Str;
use Tests\Fixtures\Modules\Notes\Models\Note;
use Tests\Support\AssignmentWriterInTransaction;
use Tests\Support\CommitsHookRows;
use Tests\Support\InstallsNotesModule;
use Tests\Support\StartsAgentRequests;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * A module outside the domain folder declares its own assignable record: its notes take a holder like any record, an
 * agent
 * sees only the notes it wrote, and with the module gone its records can no longer be read while retirement still
 * releases them.
 */
final class ModuleAssignmentTest extends TestCase
{
    use CommitsHookRows;
    use InstallsNotesModule;
    use StartsAgentRequests;

    private const array TABLES = ['users', 'agents', 'assignments'];

    private User $owner;

    private Agent $main;

    private Agent $writer;

    private Note $note;

    protected function setUp(): void
    {
        parent::setUp();

        $this->createNotesTables();
        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $this->main = Agent::create('Main', 'main-agent');
        $this->writer = Agent::create('Writer', 'read-only-helper');
    }

    protected function tearDown(): void
    {
        $this->dropNotesTables();

        parent::tearDown();
    }

    public function test_a_modules_note_takes_a_holder_like_any_record(): void
    {
        $this->installNotes();
        $this->startUserRequestAs($this->owner->id);

        $result = $this->app->make(AssignmentWriterInTransaction::class)->assign(
            $this->note->assignmentIdentity(),
            AssigneeIdentity::of($this->writer),
        );
        $set = $this->app->make(AssignmentResolver::class)->assignmentsFor([$this->note->assignmentIdentity()]);

        $this->assertCount(1, $result->changes);
        $this->assertTrue(
            $set->forRecord($this->note->assignmentIdentity())->get()->holder()->isSameAs(
                AssigneeIdentity::of($this->writer),
            ),
        );
    }

    public function test_an_agent_sees_only_the_notes_it_wrote_and_nobody_reads_without_acting(): void
    {
        $this->installNotes();
        $this->startUserRequestAs($this->owner->id);
        $this->app->make(AssignmentWriterInTransaction::class)->assign(
            $this->note->assignmentIdentity(),
            AssigneeIdentity::of($this->writer),
        );

        $this->startRequestAs($this->main->id, TestIds::of(1));
        $hidden = $this->app->make(AssignmentResolver::class)->assignmentsFor([$this->note->assignmentIdentity()]);
        $this->assertThrows(
            fn () => $this->app->make(AssignmentWriterInTransaction::class)->assign(
                $this->note->assignmentIdentity(),
                AssigneeIdentity::of($this->main),
            ),
            RecordUnavailable::class,
        );

        $this->startRequestAs($this->writer->id, TestIds::of(2));
        $own = $this->app->make(AssignmentResolver::class)->assignmentsFor([$this->note->assignmentIdentity()]);

        $this->app->forgetScopedInstances();
        $this->assertThrows(
            fn () => $this->app->make(AssignmentResolver::class)->assignmentsFor([$this->note->assignmentIdentity()]),
            ActorContextMissing::class,
        );

        $this->assertSame([], $hidden->assignments);
        $this->assertCount(1, $own->assignments);
    }

    public function test_without_the_module_its_records_cannot_be_read_but_retirement_still_releases_them(): void
    {
        $noteId = strtolower((string) Str::ulid());
        AssignmentRecord::query()->insert(
            [
                'id' => strtolower((string) Str::ulid()),
                'record_type' => Note::LINK_TYPE,
                'record_id' => $noteId,
                'holder_type' => 'agent',
                'holder_id' => $this->writer->id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        );
        $this->startUserRequestAs($this->owner->id);

        $this->assertThrows(
            fn () => $this->app->make(AssignmentResolver::class)->assignmentsFor(
                [new RecordIdentity(Note::LINK_TYPE, $noteId)],
            ),
            AssignmentTypeUnavailable::class,
        );

        $result = $this->app->make(CommandBus::class)->run(new RetireAgentCommand($this->writer->id));

        $this->assertCount(1, $result->changes);
        $this->assertSame(0, AssignmentRecord::query()->withoutGlobalScopes()->count());
    }

    /**
     * Registers the module as a package would: its provider, and its assignable record through the domain foundation.
     */
    private function installNotes(): void
    {
        $this->installNotesModule();
        $this->note = new Note(['text' => 'Check the lock order']);
        $this->note->saveFor($this->writer->id);
    }
}
