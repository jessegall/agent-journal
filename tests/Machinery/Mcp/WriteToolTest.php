<?php

declare(strict_types=1);

namespace Tests\Machinery\Mcp;

use App\Commands\Profiles\ActivateProfiles\ActivateProfilesCommand;
use App\Contracts\Bus\CommandBus;
use App\Mcp\Support\McpCatalogue;
use App\Support\CatalogueReflectorFactory;
use App\Support\CommandRegistry;
use App\Support\CommandScope;
use App\Support\MiddlewareDeclaration;
use App\Support\RequestKey;
use App\Values\ProfileBase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Tests\Fixtures\Agents\TestStart;
use Tests\Fixtures\Mcp\WriteNoteTool;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\RefuseNoteAtQuota;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\RefusesAll;
use Tests\Fixtures\Modules\Notes\Commands\WriteNote\WriteNoteCommand;
use Tests\Fixtures\Profiles\TestProposals;
use Tests\Machinery\Bus\CommandBusTestCase;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\TestIds;

#[TestsMachinery(McpCatalogue::class)]
final class WriteToolTest extends CommandBusTestCase
{
    private const string QUOTA_REFUSAL = 'The note quota is full.';

    private const string MIDDLEWARE_REFUSAL = 'Refused by the test middleware.';

    private const string PATH = '/agent/test/notes/write';

    private const string PROFILE = 'note-writer';

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->installProfiles();
    }

    protected function tearDown(): void
    {
        $this->emptyTables(
            'command_receipts',
            'session_tokens',
            'agent_stacks',
            'agent_sessions',
            'agents',
            'profile_revisions',
            'profiles',
            'profile_drafts',
        );

        parent::tearDown();
    }

    public function test_mcp_and_the_agent_route_each_run_the_same_note_handler_once(): void
    {
        $start = $this->startWithNotes();
        Route::middleware('journal.agent')->post(
            self::PATH,
            static fn (Request $request, CommandBus $bus) => [
                'note_id' => $bus->run(new WriteNoteCommand($request->string('text')->toString())),
            ],
        );

        $note = ['text' => 'A note from either transport.', 'request_key' => 'mcp-note-1'];
        $mcpId = $this->journal->mcpTool($start, 'write_note', $note)->assertOk()
            ->assertJsonPath('result.isError', false)
            ->json('result.structuredContent.note_id');
        $this->assertSame(1, $this->rowCount());
        $this->assertSame($note['text'], $this->rowText($mcpId));

        $routeId = $this->journal->agentCall($start, 'POST', self::PATH, [...$note, 'request_key' => 'route-note-1'])
            ->assertOk()->json('note_id');
        $this->assertSame(2, $this->rowCount());
        $this->assertSame($this->rowText($mcpId), $this->rowText($routeId));

        $this->journal->mcpTool($start, 'write_note', $note)->assertOk()->assertJsonPath(
            'result.structuredContent.note_id',
            $mcpId,
        );
        $this->journal->agentCall($start, 'POST', self::PATH, $note)->assertOk()->assertJsonPath('note_id', $mcpId);
        $this->assertSame(2, $this->rowCount());
    }

    public function test_a_module_middleware_preserves_its_coded_refusal(): void
    {
        $start = $this->startWithNotes(
            MiddlewareDeclaration::around(RefuseNoteAtQuota::class, CommandScope::command(WriteNoteCommand::class)),
        );

        $this->journal->mcpTool($start, 'write_note', ['text' => 'Over quota.', 'request_key' => 'quota-1'])->assertOk()
            ->assertJsonPath('result.isError', true)
            ->assertJsonPath('result.structuredContent.code', 'conflict')
            ->assertJsonPath('result.structuredContent.message', self::QUOTA_REFUSAL);
        $this->assertSame(0, $this->rowCount());
    }

    public function test_a_plain_command_refusal_is_forbidden_with_its_message(): void
    {
        $start = $this->startWithNotes(
            MiddlewareDeclaration::around(RefusesAll::class, CommandScope::command(WriteNoteCommand::class)),
        );

        $this->journal->mcpTool($start, 'write_note', ['text' => 'Refused.', 'request_key' => 'refusal-1'])->assertOk()
            ->assertJsonPath('result.isError', true)
            ->assertJsonPath('result.structuredContent.code', 'forbidden')
            ->assertJsonPath('result.structuredContent.message', self::MIDDLEWARE_REFUSAL);
        $this->assertSame(0, $this->rowCount());
    }

    public function test_a_write_requires_a_bounded_request_key_and_publishes_its_hints(): void
    {
        $start = $this->startWithNotes();
        $tool = new WriteNoteTool()->toArray();
        $this->assertContains('request_key', $tool['inputSchema']['required']);
        $this->assertSame(RequestKey::LONGEST, $tool['inputSchema']['properties']['request_key']['maxLength']);
        $this->assertFalse($tool['annotations']['destructiveHint']);
        $this->assertTrue($tool['annotations']['idempotentHint']);

        $this->journal->mcpTool($start, 'write_note', ['text' => 'No key.'])->assertOk()
            ->assertJsonPath('result.structuredContent.code', 'invalid_input');
        $this->journal->mcpTool($start, 'write_note', [
            'text' => 'Long key.',
            'request_key' => str_repeat('a', RequestKey::LONGEST + 1),
        ])->assertOk()->assertJsonPath('result.structuredContent.code', 'invalid_input');
        $this->assertSame(0, $this->rowCount());
    }

    private function startWithNotes(MiddlewareDeclaration ...$middleware): TestStart
    {
        $this->installCommandModules(...$middleware);
        $this->journal->actAsUserId(TestIds::of(7));
        $this->app->make(CommandBus::class)->run(new ActivateProfilesCommand(TestProposals::of(
            TestProposals::profile(self::PROFILE, ProfileBase::mainAgent()),
        )));
        $catalogue = new McpCatalogue(
            $this->app->make(CommandRegistry::class),
            new CatalogueReflectorFactory(),
            $this->app,
        );
        $catalogue->registerTool(WriteNoteTool::class);
        $this->app->instance(McpCatalogue::class, $catalogue);

        return $this->journal->signedStart('Started agent', self::PROFILE);
    }
}
