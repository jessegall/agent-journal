<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Core\Actors\Exceptions\ActorContextMissing;
use App\Core\Actors\Support\ActorIdentity;
use App\Core\Agents\Contracts\AgentRetirement;
use App\Core\Agents\Models\Agent;
use App\Core\Assignments\Contracts\AssignmentReader;
use App\Core\Assignments\Contracts\AssignmentRegistration;
use App\Core\Assignments\Contracts\AssignmentWriter;
use App\Core\Assignments\Exceptions\AssignmentTypeUnavailable;
use App\Core\Assignments\Exceptions\RecordUnavailable;
use App\Core\Assignments\Models\AssignmentRecord;
use App\Domain\Access\Models\User;
use App\Domain\Access\Support\AccessSettings;
use App\Domain\DomainRegistry;
use Illuminate\Support\Facades\Schema;
use Tests\Fixtures\Modules\Cards\CardsDomain;
use Tests\Fixtures\Modules\Notes\Models\Note;
use Tests\Fixtures\Modules\Notes\NotesDomain;
use Tests\Fixtures\Modules\Notes\Providers\NotesServiceProvider;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;
use Tests\TestCase;

/**
 * A module outside app/Domain declares its own assignable record: its notes take a holder like any record, an agent
 * sees only the notes it wrote, and with the module gone its records can no longer be read while retirement still
 * releases them.
 */
final class ModuleAssignmentTest extends TestCase
{
    use CommitsHookRows;
    use StartsAgentRequests;

    private const array TABLES = ['users', 'agents', 'assignments'];

    private User $owner;

    private Agent $main;

    private Agent $writer;

    private Note $note;

    protected function setUp(): void
    {
        parent::setUp();

        $this->createNotesTable();
        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $this->main = Agent::query()->create(['name' => 'Main', 'role' => 'hooks.main_ready']);
        $this->writer = Agent::query()->create(['name' => 'Writer', 'role' => 'hooks.read_only_helper_ready']);
        $this->note = new Note(['text' => 'Check the lock order']);
        $this->note->saveFor($this->writer->id);
    }

    protected function tearDown(): void
    {
        Schema::dropIfExists('module_notes');

        parent::tearDown();
    }

    public function test_a_modules_note_takes_a_holder_like_any_record(): void
    {
        $this->installNotes();
        $this->startUserRequestAs($this->owner->id);

        $result = $this->app->make(AssignmentWriter::class)->assign($this->note->assignmentIdentity(), ActorIdentity::of($this->writer));
        $set = $this->app->make(AssignmentReader::class)->assignmentsFor([$this->note->assignmentIdentity()]);

        $this->assertCount(1, $result->changes);
        $this->assertTrue($set->forRecord($this->note->assignmentIdentity())->get()->holder()->isSameAs(ActorIdentity::of($this->writer)));
    }

    public function test_an_agent_sees_only_the_notes_it_wrote_and_nobody_reads_without_acting(): void
    {
        $this->installNotes();
        $this->startUserRequestAs($this->owner->id);
        $this->app->make(AssignmentWriter::class)->assign($this->note->assignmentIdentity(), ActorIdentity::of($this->writer));

        $this->startRequestAs($this->main->id, 1);
        $hidden = $this->app->make(AssignmentReader::class)->assignmentsFor([$this->note->assignmentIdentity()]);
        $this->assertThrows(fn () => $this->app->make(AssignmentWriter::class)->assign($this->note->assignmentIdentity(), ActorIdentity::of($this->main)), RecordUnavailable::class);

        $this->startRequestAs($this->writer->id, 2);
        $own = $this->app->make(AssignmentReader::class)->assignmentsFor([$this->note->assignmentIdentity()]);

        $this->app->forgetScopedInstances();
        $this->assertThrows(fn () => $this->app->make(AssignmentReader::class)->assignmentsFor([$this->note->assignmentIdentity()]), ActorContextMissing::class);

        $this->assertSame([], $hidden->assignments);
        $this->assertCount(1, $own->assignments);
    }

    public function test_without_the_module_its_records_cannot_be_read_but_retirement_still_releases_them(): void
    {
        AssignmentRecord::query()->insert(['record_type' => Note::LINK_TYPE, 'record_id' => $this->note->id, 'holder_type' => 'agent', 'holder_id' => $this->writer->id, 'created_at' => now(), 'updated_at' => now()]);
        $this->startUserRequestAs($this->owner->id);

        $this->assertThrows(fn () => $this->app->make(AssignmentReader::class)->assignmentsFor([$this->note->assignmentIdentity()]), AssignmentTypeUnavailable::class);

        $result = $this->app->make(AgentRetirement::class)->retire($this->writer->id);

        $this->assertCount(1, $result->changes);
        $this->assertSame(0, AssignmentRecord::query()->withoutGlobalScopes()->count());
    }

    /**
     * Registers the module as a package would: its provider, and its assignable record through the domain foundation.
     */
    private function installNotes(): void
    {
        $this->app->register(NotesServiceProvider::class);
        DomainRegistry::from([CardsDomain::class, NotesDomain::class])->registerAssignmentsIn($this->app->make(AssignmentRegistration::class));
    }

    /**
     * Runs the module's own migrations, which only the architecture fixtures register.
     */
    private function createNotesTable(): void
    {
        foreach (glob(base_path('tests/Fixtures/Modules/Notes/Database/Migrations/*.php')) ?: [] as $migration) {
            (require $migration)->up();
        }
    }
}
