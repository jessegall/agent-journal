<?php

declare(strict_types=1);

namespace Tests\Feature\Mcp;

use App\Mcp\Servers\JournalServer;
use App\Models\Access\User;
use App\Support\Access\AccessSettings;
use App\Support\AssigneeIdentity;
use Domain\Tasks\Models\Task;
use Illuminate\Http\Response;
use Illuminate\Testing\TestResponse;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\AssignmentWriterInTransaction;
use Tests\Support\CommitsHookRows;
use Tests\Support\SendsMcpFrames;
use Tests\Support\StartsAgentRequests;
use Tests\TestCase;

/**
 * overview_read, capabilities_read and journal://v1/overview: the caller's own orientation, loaded up front.
 */
final class OrientationToolsTest extends TestCase
{
    use CommitsHookRows;
    use SendsMcpFrames;
    use StartsAgentRequests;

    private const array TABLES = [
        'users',
        'agents',
        'agent_sessions',
        'start_tokens',
        'tasks',
        'plans',
        'assignments',
        'agent_stacks',
    ];

    private TestStart $caller;

    private TestStart $other;

    protected function setUp(): void
    {
        parent::setUp();

        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->caller = TestStart::start();
        $this->other = TestStart::start();
        $this->startUserRequestAs($owner->id);
        $writer = $this->app->make(AssignmentWriterInTransaction::class);

        $tasks = Task::factory()->count(3)->sequence(
            ['title' => 'One'],
            ['title' => 'Two'],
            ['title' => 'Three'],
        )->create();

        foreach ($tasks as $task) {
            $writer->assign($task->assignmentIdentity(), AssigneeIdentity::of($this->caller->agent));
        }

        $writer->assign(
            Task::factory()->create(['title' => 'Not yours'])->assignmentIdentity(),
            AssigneeIdentity::of($this->other->agent),
        );
    }

    public function test_overview_read_counts_only_the_callers_held_tasks_with_a_next_action_to_tasks_assigned(): void
    {
        $result = $this->callTool('overview_read')->json('result.structuredContent');

        $this->assertSame($this->caller->agent->id, $result['agent_id']);
        $this->assertSame($this->caller->session->id, $result['session_id']);
        $this->assertSame(3, $result['sections']['tasks']['counts']['held']);
        $this->assertSame('tasks_assigned', $result['sections']['tasks']['next_action']['tool']);
        $this->assertSame(0, $result['sections']['plans']['counts']['held']);
    }

    public function test_capabilities_read_reports_three_separate_version_values(): void
    {
        $result = $this->callTool(
            'capabilities_read',
            ['HTTP_MCP_PROTOCOL_VERSION' => '2025-11-25'],
        )->json('result.structuredContent');

        $this->assertSame(JournalServer::contractVersion(), $result['contract_version']);
        $this->assertIsString($result['server_build']);
        $this->assertSame('2025-11-25', $result['protocol_version']);
        $this->assertSame('main-agent', $result['job_profile']);
        $this->assertContains('overview_read', $result['tools']);
    }

    public function test_a_profile_that_edits_documents_reads_their_drafts_and_a_read_only_helper_does_not(): void
    {
        $tools = fn (TestStart $start) => $this->callMcpTool($start, 'capabilities_read', [])
            ->json('result.structuredContent.tools');

        $this->assertContains('docs_drafts_read', $tools($this->caller));
        $this->assertNotContains('docs_drafts_read', $tools(TestStart::start('read-only-helper')));
    }

    public function test_the_overview_resource_gives_the_same_content(): void
    {
        $tool = $this->callTool('overview_read')->json('result.structuredContent');
        $resource = $this->sendMcp(
            $this->caller,
            'resources/read',
            ['uri' => 'journal://v1/overview'],
        )->assertOk()->json('result.contents.0');

        $this->assertSame('application/json', $resource['mimeType']);
        $this->assertSame($tool, json_decode($resource['text'], true));
    }

    public function test_both_descriptors_carry_always_load_and_an_output_schema(): void
    {
        $tools = array_column(
            $this->sendMcp($this->caller, 'tools/list')->assertOk()->json('result.tools'),
            null,
            'name',
        );

        foreach (['overview_read', 'capabilities_read'] as $name) {
            $this->assertTrue($tools[$name]['_meta']['anthropic/alwaysLoad']);
            $this->assertArrayHasKey('outputSchema', $tools[$name]);
            $this->assertTrue($tools[$name]['annotations']['readOnlyHint']);
        }
    }

    /**
     * @param  array<string, string>  $headers
     * @return TestResponse<Response>
     */
    private function callTool(string $name, array $headers = []): TestResponse
    {
        return $this->callMcpTool($this->caller, $name, [], $headers)->assertJsonPath('result.isError', false);
    }
}
