<?php

declare(strict_types=1);

namespace Tests\Machinery\Mcp;

use App\Api\SignedCall;
use App\Bus\Exceptions\ApiFailedUnexpectedly;
use App\Mcp\Exceptions\ResultTooLarge;
use App\Mcp\Support\McpCatalogue;
use App\Models\Records\Layout;
use App\Sessions\Enums\TransportProfileType;
use App\Support\AgentContext;
use App\Terminals\Commands\SaveLayout\SaveLayoutCommand;
use App\Terminals\Data\LayoutShape;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Exceptions;
use Tests\Commands\Terminals\SaveLayoutTest;
use Tests\Fixtures\Mcp\FixtureReadTool;
use Tests\Fixtures\Mcp\FixtureServer;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\TestCase;

/**
 * The journal tool base: strict arguments and schema, coded refusals, a generic answer to an unexpected failure and
 * the byte budget of a result. A read tool only reads: a command it sends is refused naming the tool, and a write it
 * makes to the database itself fails there.
 */
#[TestsMachinery(McpCatalogue::class)]
final class JournalToolTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'users',
        'layouts',
        'command_receipts',
    ];

    private const string SECRET_DETAIL = 'secret detail';

    private const string CALL_ID = 'call-correlation-1';

    protected function setUp(): void
    {
        parent::setUp();

        $this->signCall();
    }

    /**
     * Binds the agent context of a signed call, as the agent middleware does; acting as a user starts a new request
     * scope, so a test that acts binds it again.
     */
    private function signCall(): void
    {
        $this->app->instance(
            AgentContext::class,
            new AgentContext(
                'agent-1',
                'session-1',
                new SignedCall(self::CALL_ID, CarbonImmutable::now(), 'digest'),
                null,
                TransportProfileType::Mcp,
            ),
        );
    }

    public function test_a_record_answers_with_status_payload_and_next_actions(): void
    {
        FixtureServer::tool(FixtureReadTool::class, ['number' => 4, 'answer' => 'record'])
            ->assertOk()
            ->assertExactStructuredContent([
                'status' => 'ok',
                'number' => 4,
                'next_actions' => [['tool' => 'fixture_read', 'arguments' => ['number' => 5, 'answer' => 'record']]],
            ]);
    }

    public function test_an_unknown_argument_answers_invalid_input_naming_it(): void
    {
        FixtureServer::tool(FixtureReadTool::class, ['number' => 4, 'answer' => 'record', 'colour' => 'red'])
            ->assertHasErrors(['colour'])
            ->assertStructuredContentPath('code', 'invalid_input')
            ->assertStructuredContentPath('retryable', false);
    }

    public function test_an_argument_of_the_wrong_type_answers_invalid_input(): void
    {
        FixtureServer::tool(FixtureReadTool::class, ['number' => 'four', 'answer' => 'record'])
            ->assertHasErrors(['number'])
            ->assertStructuredContentPath('code', 'invalid_input');
    }

    public function test_the_published_schema_refuses_additional_properties(): void
    {
        $schema = $this->app->make(FixtureReadTool::class)->toArray()['inputSchema'];

        $this->assertFalse($schema['additionalProperties']);
        $this->assertSame(['number', 'answer'], array_keys($schema['properties']));
        $this->assertTrue($this->app->make(FixtureReadTool::class)->toArray()['annotations']['readOnlyHint']);
    }

    public function test_a_coded_refusal_becomes_an_error_result_with_its_code(): void
    {
        FixtureServer::tool(FixtureReadTool::class, ['number' => 4, 'answer' => 'refused'])
            ->assertHasErrors(['Record 4 is not available.'])
            ->assertStructuredContent(
                ['code' => 'record_unavailable', 'message' => 'Record 4 is not available.', 'retryable' => false],
            );
    }

    public function test_an_unexpected_failure_gives_the_generic_message_and_correlation_id_even_with_debug_on(): void
    {
        config(['app.debug' => true]);
        Exceptions::fake();

        FixtureServer::tool(FixtureReadTool::class, ['number' => 4, 'answer' => 'broken'])
            ->assertHasErrors([self::CALL_ID])
            ->assertDontSee(self::SECRET_DETAIL)
            ->assertStructuredContentPath('code', 'unavailable');

        Exceptions::assertReported(
            fn (ApiFailedUnexpectedly $failure): bool => str_contains($failure->getMessage(), self::CALL_ID),
        );
    }

    public function test_a_20_kib_result_is_refused_by_the_budget_with_a_safe_error(): void
    {
        Exceptions::fake();

        FixtureServer::tool(FixtureReadTool::class, ['number' => 4, 'answer' => 'large'])
            ->assertHasErrors([self::CALL_ID])
            ->assertDontSee('aaaa')
            ->assertStructuredContentPath('code', 'unavailable');

        Exceptions::assertReported(
            fn (ApiFailedUnexpectedly $failure): bool => $failure->getPrevious() instanceof ResultTooLarge,
        );
    }

    public function test_a_command_a_read_tool_sends_is_refused_naming_the_tool(): void
    {

        FixtureServer::tool(FixtureReadTool::class, ['number' => 1, 'answer' => 'sends'])
            ->assertHasErrors(['the read tool fixture_read'])
            ->assertStructuredContentPath('code', 'forbidden');

        $this->assertSame(0, Layout::query()->count());
    }

    public function test_a_write_a_read_tool_makes_to_the_database_fails_there(): void
    {
        $this->journal->owner()->actAs('Owner')
            ->run(new SaveLayoutCommand('Kept', LayoutShape::from(SaveLayoutTest::shape('chat'))));
        $this->signCall();
        Exceptions::fake();

        FixtureServer::tool(FixtureReadTool::class, ['number' => 1, 'answer' => 'writes'])
            ->assertHasErrors([self::CALL_ID])
            ->assertStructuredContentPath('code', 'unavailable');

        $this->assertSame(1, Layout::query()->count());
    }
}
