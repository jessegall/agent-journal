<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Commands;

use App\Bus\Contracts\CommandBus;
use App\Bus\RequestKey;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Models\Inboxes\Inbox;
use App\Models\Messages\Message;
use App\Support\ActorReference;
use App\Support\Command;
use Domain\Chat\ChatDomain;
use Domain\Chat\Commands\DockSource\DockSourceCommand;
use Domain\Chat\Commands\UndockSource\UndockSourceCommand;
use Domain\Chat\Enums\DockOutcome;
use Domain\Chat\Exceptions\ChatUnavailable;
use Domain\Chat\Models\DockPlacement;
use Domain\Chat\Resolvers\Support\DockListing;
use Domain\Chat\Support\DockProjection;
use Domain\Chat\Support\DockRequests;
use Domain\Chat\Support\Wire\EncodedCard;
use Domain\Chat\Tests\Fixtures\ChatFixtures;
use Domain\Chat\Tests\TestCase;
use Domain\Chat\Values\DockResult;
use Domain\Documents\DocumentsDomain;
use Domain\Rules\RulesDomain;
use Domain\Tasks\Models\Task;
use Domain\Tasks\TasksDomain;
use Illuminate\Support\Str;
use Tests\Fixtures\Agents\TestStart;
use Tests\Fixtures\Modules\Notes\Models\Note;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\InstallsNotesModule;
use Tests\Support\TestProjects;

/**
 * A user docks a source in a conversation once: a second dock of it answers the placement it has, and an agent the
 * user cannot see or a conversation the user takes no part in is refused before anything is docked.
 */
#[TestsCommand(DockSourceCommand::class)]
final class DockSourceTest extends TestCase
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
        'inboxes',
        'inbox_members',
        'assignments',
        'command_receipts',
        'links',
        'tasks',
        'dock_placements',
        'number_groups',
        'messages',
        'documents',
        'document_revisions',
        'document_drafts',
        'document_closes',
        'reports',
    ];

    private const string KEY = '01JD8X0G9M3QZ6V4K2DOCKADD01';

    private const string TASK_TITLE = 'Feed the cat';

    private User $owner;

    private string $agentId;

    private string $conversationId;

    private Task $task;

    private TestStart $start;

    private string $chatInboxId;

    private TestStart $agent;

    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(
            ChatDomain::class,
            TasksDomain::class,
            RulesDomain::class,
            DocumentsDomain::class,
        );
    }

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = $this->journal->owner()->ownerUser();

        $this->agentId = $this->journal->idleAgent('Builder')
            ->startSession('Builder', 'Builder')
            ->sessionCalled('Builder')->agent_id;

        $this->journal->fixtures(ChatFixtures::class)->pairChat(
            ActorReference::of($this->owner),
            ActorReference::ofClass(Agent::class, $this->agentId),
        );

        $this->task = Task::factory()->create(['title' => 'Ship the dock']);
        $this->journal->actAsUserId($this->owner->id);
        $this->conversationId = $this->app->make(DockRequests::class)->inboxWith($this->agentId)->id;
    }

    public function test_a_second_dock_of_one_source_answers_its_one_placement(): void
    {
        $added = $this->runKeyed($this->dockTask(), (string) Str::ulid());
        $present = $this->runKeyed($this->dockTask(), (string) Str::ulid());

        $this->assertSame([DockOutcome::Added, DockOutcome::Present], [$added->outcome, $present->outcome]);

        $this->assertSame($added->placementId, $present->placementId);
        $this->assertSame(1, DockPlacement::query()->count());
    }

    public function test_a_placement_carries_its_sources_project_and_a_dock_under_one_project_shows_only_its_own(): void
    {
        $this->journal->project('B');
        $other = Task::factory()->create(['project_id' => $this->journal->projectCalled('B')->id]);

        $local = $this->runKeyed($this->dockTask(), (string) Str::ulid());

        $inB = $this->runKeyed(
            new DockSourceCommand($this->conversationId, 'tasks.task', $other->id),
            (string) Str::ulid(),
        );

        $this->assertSame(
            [TestProjects::local()->id, $this->journal->projectCalled('B')->id],
            [
                DockPlacement::query()->findOrFail($local->placementId)->project_id,
                DockPlacement::query()->findOrFail($inB->placementId)->project_id,
            ],
        );

        $this->journal->selectProject('B');
        $this->assertSame(1, DockPlacement::query()->count());
        $this->assertTrue(DockPlacement::query()->whereKey($inB->placementId)->exists());
    }

    public function test_an_agent_out_of_sight_is_refused_before_anything_is_docked(): void
    {
        $this->expectException(ChatUnavailable::class);

        try {
            $this->app->make(DockRequests::class)->inboxWith(strtolower((string) Str::ulid()));
        } finally {
            $this->assertSame(0, DockPlacement::query()->count());
        }
    }

    public function test_a_conversation_the_user_takes_no_part_in_is_refused(): void
    {
        $strangers = $this->journal->fixtures(ChatFixtures::class)->pairChat(
            ActorReference::ofClass(Agent::class, 'agent-one'),
            ActorReference::ofClass(Agent::class, 'agent-two'),
        );

        $this->expectException(ChatUnavailable::class);

        $this->runKeyed(
            new DockSourceCommand($strangers->id, 'tasks.task', $this->task->id),
            (string) Str::ulid(),
        );
    }

    public function test_an_agent_docks_lists_and_removes_a_record_and_a_retried_add_answers_its_first_receipt(): void
    {
        $owner = $this->journal->ownerUser();
        $this->start = $this->journal->signedStart('Main agent', 'main-agent');

        $this->journal->fixtures(ChatFixtures::class)->pairChat(
            ActorReference::of($owner),
            ActorReference::of($this->start->agent),
        );

        $this->journal->relayAgentCommands($this->start);

        $add = [
            'type' => 'tasks.task',
            'id' => $this->task->id,
            '--request-key' => self::KEY,
            '--json' => true,
        ];

        $this->artisan('dock:add', $add)->expectsOutputToContain('"outcome":"added"')->assertExitCode(0);
        $placement = DockPlacement::query()->sole();

        $this->artisan('dock:list', ['--json' => true])
            ->expectsOutputToContain(
                "\"placementId\":\"{$placement->id}\",\"type\":\"tasks.task\",\"sourceId\":\"{$this->task->id}\","
                .'"title":"Ship the dock","status":"shown"',
            )
            ->doesntExpectOutputToContain('"root"')
            ->assertExitCode(0);

        $this->artisan('dock:remove', ['placement' => $placement->id, '--json' => true])
            ->expectsOutputToContain('"outcome":"removed"')
            ->assertExitCode(0);

        $this->artisan('dock:add', $add)
            ->expectsOutputToContain("\"outcome\":\"added\",\"placementId\":\"{$placement->id}\"")
            ->assertExitCode(0);

        $this->assertSame(0, DockPlacement::query()->count());
    }

    public function test_an_agent_in_several_conversations_names_one_before_anything_is_docked(): void
    {
        $owner = $this->journal->ownerUser();
        $this->start = $this->journal->signedStart('Main agent', 'main-agent');

        $this->journal->fixtures(ChatFixtures::class)->pairChat(
            ActorReference::of($owner),
            ActorReference::of($this->start->agent),
        );

        $this->journal->fixtures(ChatFixtures::class)->pairChat(
            ActorReference::of($this->start->agent),
            ActorReference::ofClass(Agent::class, 'another-agent'),
        );

        $this->journal->relayAgentCommands($this->start);

        $this->artisan('dock:add', ['type' => 'tasks.task', 'id' => $this->task->id])
            ->expectsOutputToContain(ChatUnavailable::unnamed()->getMessage())
            ->assertFailed();

        $this->assertSame(0, DockPlacement::query()->count());
    }

    public function test_a_message_docked_from_its_row_answers_added_then_present_and_shows_its_first_line(): void
    {
        $owner = $this->journal->ownerUser();

        $session = $this->journal->idleAgent('Dock builder')
            ->startSession('Dock builder', 'Dock builder')
            ->sessionCalled('Dock builder');

        $message = $this->journal->inboxes()->post(
            $this->journal->inboxes()->personal(ActorReference::of($owner)),
            $owner,
            "Build ready\nAll checks passed.",
        );

        $inboxId = $this->journal->fixtures(ChatFixtures::class)->pairChat(
            ActorReference::of($owner),
            ActorReference::ofClass(Agent::class, $session->agent_id),
        )->id;

        $dock = new DockSourceCommand($inboxId, Message::linkType(), $message->id);
        $this->owner = $owner;
        $this->assertSame(DockOutcome::Added, $this->runKeyed($dock, (string) Str::ulid())->outcome);
        $this->assertSame(DockOutcome::Present, $this->runKeyed($dock, (string) Str::ulid())->outcome);

        $this->assertSame(['Build ready'], $this->dockedTitles(Inbox::query()->findOrFail($inboxId)));
    }

    public function test_notes_docked_by_the_owner_and_an_agent_show_each_side_only_what_it_may_read(): void
    {
        $this->createNotesTables();
        $this->installNotesModule();
        $this->owner = $this->journal->ownerUser();
        $this->agent = $this->journal->signedStart('Main agent', 'main-agent');

        $this->chatInboxId = $this->journal->fixtures(ChatFixtures::class)->pairChat(
            ActorReference::of($this->owner),
            ActorReference::of($this->agent->agent),
        )->id;

        $ownersNote = new Note(['text' => 'Water the plants']);
        $ownersNote->belongTo(ActorReference::of($this->owner));
        $ownersNote->save();
        $agentsNote = new Note(['text' => 'Feed the cat']);
        $agentsNote->saveFor($this->agent->agent->id);

        $this->runKeyed(
            new DockSourceCommand($this->chatInboxId, Note::linkType(), $ownersNote->id),
            (string) Str::ulid(),
        );

        $this->journal->keyed(
            fn () => $this->journal->runAsStart(
                $this->agent,
                new DockSourceCommand(null, Note::linkType(), $agentsNote->id),
            ),
        );

        $this->agent->startRequest($this->app);

        $listed = $this->app->make(DockListing::class)
            ->of(Inbox::query()->findOrFail($this->chatInboxId), DockProjection::LARGEST_CARD_LIMIT)
            ->toArray();

        $this->assertSame(
            [['unavailable', ''], ['shown', self::TASK_TITLE]],
            array_map(fn (array $placement) => [
                $placement['status'],
                $placement['title'],
            ], $listed['placements']),
        );

        $placement = DockPlacement::query()->where('dockable_id', $agentsNote->id)->sole();

        $this->journal->keyed(fn () => $this->journal->runAsStart(
            $this->agent,
            new UndockSourceCommand(null, $placement->id, Note::linkType(), $agentsNote->id),
        ));

        $this->assertSame(1, DockPlacement::query()->count());
    }

    private function dockTask(): DockSourceCommand
    {
        return new DockSourceCommand($this->conversationId, 'tasks.task', $this->task->id);
    }

    /**
     * @param  Command<DockResult>  $command
     */
    private function runKeyed(Command $command, string $key): DockResult
    {
        $this->journal->actAsUserId($this->owner->id);
        $this->app->make(RequestKey::class)->set($key);

        try {
            return $this->app->make(CommandBus::class)->run($command);
        } finally {
            $this->app->make(RequestKey::class)->forget();
        }
    }

    private function startInConversation(string $profile): TestStart
    {
        $start = $this->journal->signedStart("Started {$profile}", $profile);

        $this->journal->fixtures(ChatFixtures::class)->pairChat(
            ActorReference::of($this->owner),
            ActorReference::of($start->agent),
        );

        return $start;
    }

    /**
     * @return list<string>
     */
    private function dockedTitles(Inbox $inbox): array
    {
        $cards = $this->journal->service(DockProjection::class)->page($inbox, null)->cards;

        return array_map(fn (EncodedCard $card) => $card->accessibleName, $cards);
    }
}
