<?php

declare(strict_types=1);

namespace Tests\Feature\Docking;

use App\Actors\Support\ActorIdentity;
use App\Bus\Contracts\CommandBus;
use App\Web\Events\PageChanged;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Chat\Models\Conversation;
use Domain\Chat\Support\DockProjection;
use Domain\Chat\Support\DockRequests;
use Domain\Documents\Commands\CloseReport;
use Domain\Documents\Commands\CreateReport;
use Domain\Plans\Models\Plan;
use Domain\Tasks\Api\Events\TaskCancelled;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\Models\Task;
use Illuminate\Support\Facades\Event;
use Tests\Fixtures\Agents\TestStart;
use Tests\Fixtures\Modules\Notes\Models\Note;
use Tests\Fixtures\Modules\Notes\Providers\NotesServiceProvider;
use Tests\Fixtures\Modules\Notes\Support\ReleaseReview;
use Tests\Support\CommitsHookRows;
use Tests\Support\InstallsNotesModule;
use Tests\Support\SendsMcpFrames;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WritesInboxMessages;
use Tests\TestCase;

/**
 * Reports, tasks and plans dock with cards their owners compose: a report shows Open and then Closed once settled, a
 * task its state, a plan with no phases says so without progress, and the release review fixture carries every part
 * in order, its console text plain, while its oversized twin shows only its summary.
 */
#[TimeLimit(8, 'Docks four kinds of source through MCP and reads the projected cards.')]
final class RichCardsTest extends TestCase
{
    use CommitsHookRows;
    use InstallsNotesModule;
    use SendsMcpFrames;
    use WritesInboxMessages;

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
        'tasks',
        'plans',
        'phases',
        'phase_tasks',
        'documents',
        'document_revisions',
        'document_drafts',
        'document_closes',
        'reports',
        'conversations',
        'dock_placements',
    ];

    private TestStart $agent;

    private Conversation $conversation;

    protected function setUp(): void
    {
        parent::setUp();

        $this->createNotesTables();
        $this->installNotesModule();
        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->agent = TestStart::start();
        $this->conversation = Conversation::between(
            $this->inboxOf(ActorIdentity::of($owner))->inboxId(),
            $this->inboxOf(ActorIdentity::of($this->agent->agent))->inboxId(),
        );
    }

    protected function tearDown(): void
    {
        $this->dropNotesTables();

        parent::tearDown();
    }

    public function test_a_docked_report_shows_open_and_then_closed_once_settled(): void
    {
        $this->agent->startRequest($this->app);
        $report = $this->app->make(CommandBus::class)->run(new CreateReport('Evidence', 'First run.', 'Filed text.'));
        $this->dock('documents.report', $report->id);

        $this->assertStringContainsString('"text":"Evidence"', $this->cards());
        $this->assertStringContainsString('"text":"Open","tone":"note"', $this->cards());

        $this->agent->startRequest($this->app);
        $this->app->make(CommandBus::class)->run(new CloseReport((string) $report->number, 'Done.'));

        $this->assertStringContainsString('"text":"Closed","tone":"muted"', $this->cards());
    }

    public function test_a_docked_task_shows_its_state_and_a_plan_without_phases_says_so(): void
    {
        $task = Task::factory()->create(['title' => 'Ship the dock', 'state' => TaskState::Blocked]);
        $plan = Plan::factory()->create(['title' => 'Dock plan']);
        $this->dock('tasks.task', $task->id);
        $this->dock('plans.plan', $plan->id);

        $cards = $this->cards();

        $this->assertStringContainsString('"text":"Blocked","tone":"warn"', $cards);
        $this->assertStringContainsString('"text":"No phases yet"', $cards);
        $this->assertStringNotContainsString('"type":"counted-progress"', $cards);
    }

    public function test_the_release_review_holds_every_part_in_order_and_its_oversized_twin_only_its_summary(): void
    {
        new Note(['text' => 'One check'])->saveFor($this->agent->agent->id);
        $this->dock(NotesServiceProvider::REVIEW_TYPE, ReleaseReview::KEY);
        $this->dock(NotesServiceProvider::REVIEW_TYPE, ReleaseReview::OVERSIZED_KEY);

        $cards = $this->cards();

        $this->assertMatchesRegularExpression(
            '/"completed":1,"total":8.*"label":"Waiting for estimate".*"type":"duration".*"type":"duration"/',
            $cards,
        );
        $this->assertStringContainsString('"title":"Checks","initial":"closed"', $cards);
        $this->assertStringContainsString('"lines":["error: <script>","second line"],"truncated":true', $cards);
        $this->assertStringContainsString('"accessibleName":"Release review, oversized","safeSummary":"Release review, oversized","open":null,"root":null', $cards);
    }

    public function test_a_change_of_a_docked_task_changes_the_page_and_of_a_loose_one_does_not(): void
    {
        $docked = Task::factory()->create(['title' => 'Docked']);
        $loose = Task::factory()->create(['title' => 'Loose']);
        $this->dock('tasks.task', $docked->id);
        Event::fake([PageChanged::class]);

        $this->app->make('events')->dispatch(new TaskCancelled($loose->id, TaskState::Open));
        Event::assertNotDispatched(PageChanged::class);

        $this->app->make('events')->dispatch(new TaskCancelled($docked->id, TaskState::Open));
        Event::assertDispatchedTimes(PageChanged::class, 1);
    }

    private function dock(string $type, string $id): void
    {
        $this->callMcpTool($this->agent, 'dock_add', ['type' => $type, 'id' => $id, 'request_key' => "dock-{$id}"])
            ->assertJsonPath('result.structuredContent.outcome', 'added');
    }

    private function cards(): string
    {
        $this->agent->startRequest($this->app);
        $requests = $this->app->make(DockRequests::class);
        $page = $this->app->make(DockProjection::class)->page($requests->peersIn($this->conversation), null);

        return (string) json_encode($page->cards, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    }
}
