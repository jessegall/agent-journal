<?php

declare(strict_types=1);

namespace Tests\Feature\Docking;

use Domain\Rules\RulesDomain;
use App\Enums\Processes\OutputStream;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Models\CommandRules\EvidenceRead;
use App\Models\Inboxes\Inbox;
use App\Models\Runs\PartRun;
use App\Models\Runs\ProcessRun;
use App\Support\Access\AccessSettings;
use App\Support\ActorIdentity;
use App\Support\OutputDocking;
use App\Support\SpoolRecorder;
use App\Values\CapturedChunk;
use App\Values\DockedOutput;
use App\Values\PartEnd;
use App\Values\PartKey;
use Carbon\CarbonImmutable;
use Domain\Chat\ChatDomain;
use Domain\Chat\Listeners\RemoveDeletedSource;
use Domain\Chat\Models\DockPlacement;
use Domain\Chat\Support\DockProjection;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Testing\TestResponse;
use Tests\Fixtures\Agents\TestStart;
use Tests\Fixtures\Modules\Notes\Events\NoteRemoved;
use Tests\Fixtures\Modules\Notes\Models\Note;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\Exceptions\SimulatedFailure;
use Tests\Support\InstallsNotesModule;
use Tests\Support\OpensPairChats;
use Tests\Support\Processes\ProcessOutputDisk;
use Tests\Support\SendsMcpFrames;
use Tests\Support\TestRunAdmissions;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WritesInboxMessages;
use Tests\TestCase;

/**
 * An agent docks its own process run and one stream of it: the run shows its operation, its end and exit, the stream
 * its bounded tail, read without recording evidence, and another agent finds neither. A source deleted for good leaves
 * every conversation while a rolled-back deletion keeps it, and removing a conversation removes only its placements.
 */
#[TimeLimit(8, 'Records one run, docks it through MCP and reads the projected cards.')]
final class ProcessAndCleanupDockTest extends TestCase
{
    use CommitsHookRows;
    use InstallsNotesModule;
    use OpensPairChats;
    use SendsMcpFrames;
    use WritesInboxMessages;

    private const string RUN_TITLE = '"text":"Run of acme verify"';

    private const string EXIT_TEXT = '"text":"Exit 0"';

    private const string OUTPUT_LINES = '"lines":["first line","second line"],"truncated":false';

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
        'command_requests',
        'process_runs',
        'part_runs',
        'process_events',
        'output_chunks',
        'evidence_reads',
        'dock_placements',
    ];

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(RulesDomain::class, ChatDomain::class);
    }

    private TestStart $agent;

    private Inbox $conversation;

    protected function setUp(): void
    {
        parent::setUp();

        ProcessOutputDisk::fake();
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

    public function test_an_agent_docks_its_run_and_its_output_and_another_agent_finds_neither(): void
    {
        $part = $this->endedRun("first line\nsecond line\n");
        $runId = $part->process_run_id;
        $outputKey = DockedOutput::keyOf($runId, 1, OutputStream::Stdout);
        $evidence = EvidenceRead::query()->count();

        $this->dock(ProcessRun::DOCK_TYPE, $runId)->assertJsonPath('result.structuredContent.outcome', 'added');
        $this->dock(OutputDocking::DOCK_TYPE, $outputKey)->assertJsonPath('result.structuredContent.outcome', 'added');
        $cards = $this->cards();

        $this->assertStringContainsString(self::RUN_TITLE, $cards);
        $this->assertStringContainsString('"text":"Ended","tone":"muted"', $cards);
        $this->assertStringContainsString(self::EXIT_TEXT, $cards);
        $this->assertStringContainsString(self::OUTPUT_LINES, $cards);
        $this->assertSame($evidence, EvidenceRead::query()->count());

        $other = TestStart::start();
        $this->inboxOf(ActorIdentity::of($other->agent));
        $this->callMcpTool($other, 'dock_add', ['type' => ProcessRun::DOCK_TYPE, 'id' => $runId, 'request_key' => 'other'])
            ->assertJsonPath('result.isError', true);
    }

    public function test_a_source_deleted_for_good_leaves_every_conversation_and_a_rolled_back_deletion_keeps_it(): void
    {
        $kept = new Note(['text' => 'Kept']);
        $kept->saveFor($this->agent->agent->id);
        $gone = new Note(['text' => 'Gone']);
        $gone->saveFor($this->agent->agent->id);
        $this->dock(Note::linkType(), $kept->id);
        $this->dock(Note::linkType(), $gone->id);
        // The fixture module installs after the domains' interface listeners were spread over the exported events.
        $this->app->make('events')->listen(NoteRemoved::class, [RemoveDeletedSource::class, 'handle']);

        $this->assertThrows(
            fn () => $this->app->make(ConnectionInterface::class)->transaction(function () use ($gone): void {
                $this->app->make('events')->dispatch(new NoteRemoved($gone->id));

                throw SimulatedFailure::of('The deletion fails.');
            }),
            SimulatedFailure::class,
        );
        $this->assertSame(2, DockPlacement::query()->count());

        $this->agent->startRequest($this->app);
        $this->app->make('events')->dispatch(new NoteRemoved($gone->id));

        $this->assertSame([$kept->id], DockPlacement::query()->pluck('dockable_id')->all());
    }

    public function test_removing_a_conversation_removes_only_its_placements(): void
    {
        $note = new Note(['text' => 'Shared']);
        $note->saveFor($this->agent->agent->id);
        $this->dock(Note::linkType(), $note->id);
        $elsewhere = $this->pairChat(
            ActorIdentity::of($this->agent->agent),
            ActorIdentity::ofClass(Agent::class, 'another-agent'),
        );
        $this->callMcpTool($this->agent, 'dock_add', [
            'type' => Note::linkType(),
            'id' => $note->id,
            'chat' => $elsewhere->id,
            'request_key' => 'dock-elsewhere',
        ])->assertJsonPath('result.structuredContent.outcome', 'added');

        $this->conversation->delete();

        $this->assertSame([$elsewhere->id], DockPlacement::query()->pluck('conversation_id')->all());
    }

    private function endedRun(string $output): PartRun
    {
        $actor = ActorIdentity::of($this->agent->agent);
        $run = ProcessRun::create($actor, TestRunAdmissions::of(projectKey: (string) config('processes.project_key')));
        $part = PartRun::create($run, new PartKey(1, 1, 'acme verify'));
        $part->start('host', 1);
        $recorder = $this->app->make(SpoolRecorder::class);
        $recorder->append(new CapturedChunk($part, OutputStream::Stdout, $output, CarbonImmutable::now()));
        $part->finishProcess(PartEnd::exited(0));
        $part->finishDraining();
        $recorder->finish($part, PartEnd::exited(0));

        return $part->refresh();
    }

    private function dock(string $type, string $id): TestResponse
    {
        return $this->callMcpTool($this->agent, 'dock_add', ['type' => $type, 'id' => $id, 'request_key' => 'dock-'.md5($id)]);
    }

    private function cards(): string
    {
        $this->agent->startRequest($this->app);
        $page = $this->app->make(DockProjection::class)->page($this->conversation, null);

        return (string) json_encode($page->cards, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    }
}
