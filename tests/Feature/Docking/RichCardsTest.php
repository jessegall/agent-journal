<?php

declare(strict_types=1);

namespace Tests\Feature\Docking;

use App\Contracts\Bus\CommandBus;
use App\Models\Access\User;
use App\Models\Inboxes\Inbox;
use App\Support\Access\AccessSettings;
use App\Support\ActorIdentity;
use Domain\Chat\ChatDomain;
use Domain\Chat\Support\DockProjection;
use Domain\Documents\Commands\CloseReport\CloseReportCommand;
use Domain\Documents\Commands\CreateReport\CreateReportCommand;
use Domain\Documents\DocumentsDomain;
use Domain\Plans\Models\Plan;
use Domain\Plans\PlansDomain;
use Domain\Rules\RulesDomain;
use Domain\Tasks\Models\Task;
use Domain\Tasks\TasksDomain;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\InstallsNotesModule;
use Tests\Support\TimeLimits\TimeLimit;
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

    private const array TABLES = [
        'users',
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'hook_calls',
        'inboxes', 'inbox_members',
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
        'dock_placements',
    ];

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(
            RulesDomain::class,
            ChatDomain::class,
            DocumentsDomain::class,
            PlansDomain::class,
            TasksDomain::class,
        );
    }

    private TestStart $agent;

    private Inbox $conversation;

    protected function setUp(): void
    {
        parent::setUp();

        $this->createNotesTables();
        $this->installNotesModule();
        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->agent = TestStart::start();
        $this->conversation = $this->journal->inboxes()->pairChat(
            ActorIdentity::of($owner),
            ActorIdentity::of($this->agent->agent),
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
        $report = $this->app->make(CommandBus::class)->run(
            new CreateReportCommand('Evidence', 'First run.', 'Filed text.'),
        );
        $this->dock('documents.report', $report->id);

        $this->assertStringContainsString('"text":"Evidence"', $this->cards());
        $this->assertStringContainsString('"text":"Open","tone":"note"', $this->cards());

        $this->agent->startRequest($this->app);
        $this->app->make(CommandBus::class)->run(new CloseReportCommand((string) $report->number, 'Done.'));

        $this->assertStringContainsString('"text":"Closed","tone":"muted"', $this->cards());
    }

    private function dock(string $type, string $id): void
    {
        $this->journal->mcpTool(
            $this->agent,
            'dock_add',
            ['type' => $type, 'id' => $id, 'request_key' => "dock-{$id}"],
        )->assertOk()
            ->assertJsonPath('result.structuredContent.outcome', 'added');
    }

    private function cards(): string
    {
        $this->agent->startRequest($this->app);
        $page = $this->app->make(DockProjection::class)->page($this->conversation, null);

        return (string) json_encode($page->cards, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    }
}
