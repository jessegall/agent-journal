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
use Domain\Documents\Commands\CloseReport;
use Domain\Documents\Commands\CreateReport;
use Domain\Plans\Models\Plan;
use Domain\Tasks\Api\Events\TaskCancelled;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\Models\Task;
use Illuminate\Support\Facades\Event;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\OpensPairChats;
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
    use OpensPairChats;
    use CommitsHookRows;
    use InstallsNotesModule;
    use SendsMcpFrames;
    use WritesInboxMessages;

    private const string NO_PHASES_TEXT = '"text":"No phases yet"';

    private const string PROGRESS_PATTERN = '/"completed":1,"total":8.*"label":"Waiting for estimate"'
        .'.*"type":"duration".*"type":"duration"/';

    private const string TRUNCATED_LINES = '"lines":["error: <script>","second line"],"truncated":true';

    private const string OVERSIZED_CARD = '"accessibleName":"Release review, oversized",'
        .'"safeSummary":"Release review, oversized","open":null,"root":null';

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
        $this->conversation = $this->pairChat(ActorIdentity::of($owner), ActorIdentity::of($this->agent->agent));
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
        $this->assertStringContainsString(self::NO_PHASES_TEXT, $cards);
        $this->assertStringNotContainsString('"type":"counted-progress"', $cards);
    }

    public function test_the_release_review_holds_every_part_in_order_and_its_oversized_twin_only_its_summary(): void
    {
        new Note(['text' => 'One check'])->saveFor($this->agent->agent->id);
        $this->dock(NotesServiceProvider::REVIEW_TYPE, ReleaseReview::KEY);
        $this->dock(NotesServiceProvider::REVIEW_TYPE, ReleaseReview::OVERSIZED_KEY);

        $cards = $this->cards();

        $this->assertMatchesRegularExpression(
            self::PROGRESS_PATTERN,
            $cards,
        );
        $this->assertStringContainsString('"title":"Checks","initial":"closed"', $cards);
        $this->assertStringContainsString(self::TRUNCATED_LINES, $cards);
        $this->assertStringContainsString(self::OVERSIZED_CARD, $cards);
    }

    public function test_a_task_change_refreshes_the_page_once_whether_or_not_the_task_is_docked(): void
    {
        $docked = Task::factory()->create(['title' => 'Docked']);
        $loose = Task::factory()->create(['title' => 'Loose']);
        $this->dock('tasks.task', $docked->id);
        Event::fake([PageChanged::class]);

        // A task change refreshes every page once, docks included, so a docked task adds no second refresh.
        $this->app->make('events')->dispatch(new TaskCancelled($loose->id, TaskState::Open, 'entry'));
        Event::assertDispatchedTimes(PageChanged::class, 1);

        $this->app->make('events')->dispatch(new TaskCancelled($docked->id, TaskState::Open, 'entry'));
        Event::assertDispatchedTimes(PageChanged::class, 2);
    }

    private function dock(string $type, string $id): void
    {
        $this->callMcpTool($this->agent, 'dock_add', ['type' => $type, 'id' => $id, 'request_key' => "dock-{$id}"])
            ->assertJsonPath('result.structuredContent.outcome', 'added');
    }

    private function cards(): string
    {
        $this->agent->startRequest($this->app);
        $page = $this->app->make(DockProjection::class)->page($this->conversation, null);

        return (string) json_encode($page->cards, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    }
}
