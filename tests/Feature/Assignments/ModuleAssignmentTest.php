<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Commands\Agents\RetireAgent\RetireAgentCommand;
use App\Contracts\Assignments\AssignmentResolver;
use App\Contracts\Bus\CommandBus;
use App\Exceptions\AssignmentTypeUnavailable;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Models\Records\AssignmentRecord;
use App\Support\Access\AccessSettings;
use App\Support\RecordIdentity;
use Domain\Rules\RulesDomain;
use Illuminate\Support\Str;
use Tests\Fixtures\Modules\Notes\Models\Note;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\InstallsNotesModule;
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

    /**
     * Rules, which the Notes test module requires.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(RulesDomain::class);
    }

    /**
     * The stored type of a note, which stays in the rows while the module is gone.
     */
    private const string NOTE_TYPE = 'notes.note';

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
        $this->main = Agent::create('Main', 'main-agent', $this->localProject());
        $this->writer = Agent::create('Writer', 'read-only-helper', $this->localProject());
    }

    protected function tearDown(): void
    {
        $this->dropNotesTables();

        parent::tearDown();
    }

    public function test_without_the_module_its_records_cannot_be_read_but_retirement_still_releases_them(): void
    {
        $noteId = strtolower((string) Str::ulid());
        AssignmentRecord::query()->insert(
            [
                'id' => strtolower((string) Str::ulid()),
                'record_type' => self::NOTE_TYPE,
                'record_id' => $noteId,
                'holder_type' => 'agent',
                'holder_id' => $this->writer->id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        );
        $this->journal->actAsUserId($this->owner->id);

        $this->assertThrows(
            fn () => $this->app->make(AssignmentResolver::class)->assignmentsFor(
                [new RecordIdentity(self::NOTE_TYPE, $noteId)],
            ),
            AssignmentTypeUnavailable::class,
        );

        $result = $this->app->make(CommandBus::class)->run(new RetireAgentCommand($this->writer->id));

        $this->assertCount(1, $result->changes);
        $this->assertSame(0, AssignmentRecord::query()->withoutGlobalScopes()->count());
    }
}
