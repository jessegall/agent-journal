<?php

declare(strict_types=1);

namespace Tests\Feature\Docking;

use App\Contracts\Bus\CommandBus;
use App\Support\ActorIdentity;
use App\Support\DockDefinitions;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Chat\Models\DockPlacement;
use Domain\Documents\Commands\CreateReport\CreateReportCommand;
use Inertia\Testing\AssertableInertia;
use Tests\Fixtures\Agents\TestStart;
use Tests\Fixtures\Modules\Notes\Models\Note;
use Tests\Fixtures\Modules\Notes\Providers\NotesServiceProvider;
use Tests\Fixtures\Modules\Notes\Support\NotesTally;
use Tests\Support\CommitsHookRows;
use Tests\Support\InstallsNotesModule;
use Tests\Support\OpensPairChats;
use Tests\Support\SendsMcpFrames;
use Tests\Support\SendsSignedCalls;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WritesInboxMessages;
use Tests\TestCase;

/**
 * An owner outside Chat docks its records in PHP alone: notes dock through the chat, the journal and MCP into one
 * shared conversation, and each side sees the card a note composed only for a note it may read; a tally with no row of its own is made again after the
 * registry starts over; and a page that names the source it shows offers Add to chat with the viewer's agents.
 */
#[TimeLimit(8, 'Docks through the browser, signed calls and MCP, and reads a report page.')]
final class ExternalOwnerDockTest extends TestCase
{
    use CommitsHookRows;
    use InstallsNotesModule;
    use OpensPairChats;
    use SendsMcpFrames;
    use SendsSignedCalls;
    use WritesInboxMessages;

    private const string TASK_TITLE = 'Feed the cat';

    private const string NOTE_COUNT = '1 notes';

    private const array TABLES = [
        'users',
        'agents',
        'agent_sessions',
        'start_tokens',
        'agent_stacks',
        'hook_calls',
        'inboxes',
        'desks',
        'desk_seats',
        'desk_preferences',
        'assignments',
        'command_receipts',
        'links',
        'number_groups',
        'documents',
        'document_revisions',
        'document_drafts',
        'document_closes',
        'reports',
        'conversations',
        'dock_placements',
    ];

    private User $owner;

    private TestStart $agent;

    private string $chatInboxId;

    protected function setUp(): void
    {
        parent::setUp();

        $this->createNotesTables();
        $this->installNotesModule();
        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $this->agent = TestStart::start();
        $this->chatInboxId = $this->pairChat(ActorIdentity::of($this->owner), ActorIdentity::of($this->agent->agent))->inbox_id;
    }

    protected function tearDown(): void
    {
        $this->dropNotesTables();

        parent::tearDown();
    }

    public function test_notes_dock_through_the_chat_the_journal_and_mcp_and_each_side_sees_what_it_may_read(): void
    {
        $ownersNote = new Note(['text' => 'Water the plants']);
        $ownersNote->belongTo(ActorIdentity::of($this->owner));
        $ownersNote->save();
        $agentsNote = new Note(['text' => 'Feed the cat']);
        $agentsNote->saveFor($this->agent->agent->id);

        $this->actingAs($this->owner)
            ->postJson('/chat/dock', ['inboxId' => $this->chatInboxId, 'type' => Note::LINK_TYPE, 'id' => $ownersNote->id])
            ->assertJson(['outcome' => 'added']);
        $this->runCommandsAs($this->agent);
        $this->artisan('dock:add', ['type' => Note::LINK_TYPE, 'id' => $agentsNote->id, '--json' => true])
            ->expectsOutputToContain('"outcome":"added"')
            ->assertExitCode(0);
        $this->callMcpTool($this->agent, 'dock_list')
            ->assertJsonPath('result.structuredContent.placements.0.state', 'unavailable')
            ->assertJsonPath('result.structuredContent.placements.0.title', '')
            ->assertJsonPath('result.structuredContent.placements.1.title', self::TASK_TITLE)
            ->assertJsonPath('result.structuredContent.placements.1.state', 'shown');

        $placement = DockPlacement::query()->where('dockable_id', $agentsNote->id)->sole();
        $this->callMcpTool($this->agent, 'dock_remove', [
            'placement_id' => $placement->id,
            'type' => Note::LINK_TYPE,
            'source_id' => $agentsNote->id,
            'request_key' => 'undock-note',
        ])->assertJsonPath('result.structuredContent.outcome', 'removed');

        $this->assertSame(1, DockPlacement::query()->count());
    }

    public function test_the_notes_tally_is_made_again_from_its_key_after_the_registry_starts_over(): void
    {
        $note = new Note(['text' => 'One note']);
        $note->saveFor($this->agent->agent->id);
        $this->callMcpTool($this->agent, 'dock_add', [
            'type' => NotesServiceProvider::TALLY_TYPE,
            'id' => NotesTally::KEY,
            'request_key' => 'dock-tally',
        ])->assertJsonPath('result.structuredContent.outcome', 'added');

        $this->app->forgetScopedInstances();
        $this->app->forgetInstance(DockDefinitions::class);
        $this->app->call([new NotesServiceProvider($this->app), 'boot']);

        $this->callMcpTool($this->agent, 'dock_list')
            ->assertJsonPath('result.structuredContent.placements.0.sourceId', NotesTally::KEY)
            ->assertJsonPath('result.structuredContent.placements.0.title', self::NOTE_COUNT);
    }

    public function test_a_report_page_offers_add_to_chat_with_the_agents_the_viewer_may_see(): void
    {
        $this->agent->startRequest($this->app);
        $report = $this->app->make(CommandBus::class)->run(new CreateReportCommand('Evidence', 'First run.', 'Filed text.'));

        $this->actingAs($this->owner)
            ->get("/documents/reports/{$report->number}")
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where('page.dockOffer.label', 'Add to chat')
                ->where('page.dockOffer.type', 'documents.report')
                ->where('page.dockOffer.destinations.0.value', $this->chatInboxId));
    }

    public function test_a_report_page_is_a_publication_whose_details_settle_with_revision_one(): void
    {
        $this->agent->startRequest($this->app);
        $report = $this->app->make(CommandBus::class)->run(new CreateReportCommand('Evidence', 'First run.', 'Filed text.'));

        $this->actingAs($this->owner)
            ->get("/documents/reports/{$report->number}?tab=details")
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('layout/DeclaredLayout')
                ->where('page.data.root.children.0.children.0.text', 'Evidence')
                ->where('page.data.root.children.1.tabs.2.isChosen', true)
                ->where('page.data.root.children.1.children.0.key', 'details')
                ->where('page.data.root.children.1.children.0.children.1.form.href', "/documents/reports/{$report->number}/settle")
                ->where('page.data.root.children.1.children.0.children.1.form.fixed', ['revision' => 1])
                ->where('page.dockOffer.type', 'documents.report')
                ->missing('page.data.sourceId'));
    }

    public function test_the_links_tab_of_a_report_reads_neither_its_text_nor_its_comments(): void
    {
        $this->agent->startRequest($this->app);
        $report = $this->app->make(CommandBus::class)->run(new CreateReportCommand('Evidence', 'First run.', 'Filed text.'));

        $this->actingAs($this->owner)
            ->get("/documents/reports/{$report->number}?tab=links")
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where('page.data.root.children.1.children.0.key', 'links')
                ->where('page.data.root.children.1.children.0.native.component', 'documents/RecordLinks')
                ->missing('page.data.root.children.1.children.1'));
    }
}
