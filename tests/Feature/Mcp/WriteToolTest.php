<?php

declare(strict_types=1);

namespace Tests\Feature\Mcp;

use App\Bus\Contracts\CommandBus;
use App\Bus\Support\CommandRegistry;
use App\Bus\Support\CommandScope;
use App\Bus\Support\MiddlewareDeclaration;
use App\Bus\Support\RequestKey;
use App\Mcp\Exceptions\McpCommandMissing;
use App\Mcp\Support\McpCatalogue;
use App\Profiles\Commands\ActivateProfiles\ActivateProfilesCommand;
use App\Profiles\Values\ProfileBase;
use App\Reflection\Support\CatalogueReflectorFactory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Tests\Feature\Bus\CommandBusTestCase;
use Tests\Fixtures\Agents\TestStart;
use Tests\Fixtures\Mcp\WriteNoteTool;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\RefuseNoteAtQuota;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\RefusesAll;
use Tests\Fixtures\Modules\Notes\Commands\WriteNote\WriteNoteCommand;
use Tests\Fixtures\Profiles\TestProposals;
use Tests\Support\InstallsBuiltInProfiles;
use Tests\Support\SendsMcpFrames;
use Tests\Support\SendsSignedCalls;
use Tests\Support\TestIds;

final class WriteToolTest extends CommandBusTestCase
{
    use InstallsBuiltInProfiles;
    use SendsMcpFrames;
    use SendsSignedCalls;

    private const string QUOTA_REFUSAL = 'The note quota is full.';

    private const string MIDDLEWARE_REFUSAL = 'Refused by the test middleware.';

    private const string PATH = '/agent/test/notes/write';

    private const string PROFILE = 'note-writer';

    protected function tearDown(): void
    {
        $this->emptyTables(
            'command_receipts',
            'start_tokens',
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
        $mcpId = $this->callMcpTool($start, 'write_note', $note)
            ->assertJsonPath('result.isError', false)
            ->json('result.structuredContent.note_id');
        $this->assertSame(1, $this->rowCount());
        $this->assertSame($note['text'], $this->rowText($mcpId));

        $routeId = $this->signed($start, self::PATH, [...$note, 'request_key' => 'route-note-1'])
            ->assertOk()->json('note_id');
        $this->assertSame(2, $this->rowCount());
        $this->assertSame($this->rowText($mcpId), $this->rowText($routeId));

        $this->callMcpTool($start, 'write_note', $note)->assertJsonPath('result.structuredContent.note_id', $mcpId);
        $this->signed($start, self::PATH, $note)->assertOk()->assertJsonPath('note_id', $mcpId);
        $this->assertSame(2, $this->rowCount());
    }

    public function test_an_unregistered_command_prevents_registration_and_names_both_classes(): void
    {
        $catalogue = new McpCatalogue(CommandRegistry::of([]), new CatalogueReflectorFactory());

        $this->assertThrows(
            fn () => $catalogue->registerTool(WriteNoteTool::class),
            McpCommandMissing::class,
            McpCommandMissing::for(WriteNoteTool::class, WriteNoteCommand::class)->getMessage(),
        );
        $this->assertSame([], $catalogue->toolClasses());
    }

    public function test_a_module_middleware_preserves_its_coded_refusal(): void
    {
        $start = $this->startWithNotes(
            MiddlewareDeclaration::around(RefuseNoteAtQuota::class, CommandScope::command(WriteNoteCommand::class)),
        );

        $this->callMcpTool($start, 'write_note', ['text' => 'Over quota.', 'request_key' => 'quota-1'])
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

        $this->callMcpTool($start, 'write_note', ['text' => 'Refused.', 'request_key' => 'refusal-1'])
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

        $this->callMcpTool($start, 'write_note', ['text' => 'No key.'])
            ->assertJsonPath('result.structuredContent.code', 'invalid_input');
        $this->callMcpTool($start, 'write_note', [
            'text' => 'Long key.',
            'request_key' => str_repeat('a', RequestKey::LONGEST + 1),
        ])->assertJsonPath('result.structuredContent.code', 'invalid_input');
        $this->assertSame(0, $this->rowCount());
    }

    private function startWithNotes(MiddlewareDeclaration ...$middleware): TestStart
    {
        $this->installCommandModules(...$middleware);
        $this->startUserRequestAs(TestIds::of(7));
        $this->app->make(CommandBus::class)->run(new ActivateProfilesCommand(TestProposals::of(
            TestProposals::profile(self::PROFILE, ProfileBase::mainAgent()),
        )));
        $catalogue = new McpCatalogue($this->app->make(CommandRegistry::class), new CatalogueReflectorFactory());
        $catalogue->registerTool(WriteNoteTool::class);
        $this->app->instance(McpCatalogue::class, $catalogue);

        return TestStart::start(self::PROFILE);
    }
}
