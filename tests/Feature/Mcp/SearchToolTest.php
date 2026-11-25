<?php

declare(strict_types=1);

namespace Tests\Feature\Mcp;

use App\Support\ActorContext;
use App\Support\ActorIdentity;
use Domain\Documents\DocumentsDomain;
use Domain\Plans\Models\Plan;
use Domain\Plans\PlansDomain;
use Domain\Rules\Models\Rule;
use Domain\Rules\RulesDomain;
use Domain\Tasks\Models\Task;
use Domain\Tasks\TasksDomain;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\SendsMcpFrames;
use Tests\Support\TestIds;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WritesInboxMessages;
use Tests\TestCase;

/**
 * After the cutover the ordinary search tool serves every declared source: the six scoped searches return their
 * records, the retired types argument gets the current arguments named, and a cursor of the old contract answers
 * restart.
 */
#[TimeLimit(10, 'Six scoped searches each cross a signed MCP request.')]
final class SearchToolTest extends TestCase
{
    use CommitsHookRows;
    use SendsMcpFrames;
    use WritesInboxMessages;

    private const array TABLES = [
        'agents', 'agent_sessions', 'session_tokens', 'agent_stacks', 'command_receipts', 'number_groups', 'links',
        'tasks', 'plans', 'phases', 'phase_tasks', 'rules', 'documents', 'document_revisions', 'reports',
        'inboxes', 'inbox_members', 'assignments', 'messages',
    ];

    /**
     * The domains whose tools this test calls.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(DocumentsDomain::class, PlansDomain::class, RulesDomain::class, TasksDomain::class);
    }

    public function test_the_six_scoped_searches_return_their_records(): void
    {
        $caller = TestStart::start();
        $proposer = ActorContext::forAgent(TestIds::of(70));
        $records = [
            'tasks.task' => Task::factory()->create(['title' => 'Check the violet harbor'])->id,
            'plans.plan' => Plan::factory()->create(['title' => 'Violet harbor rollout'])->id,
            'rules.rule' => Rule::create('Mind the violet harbor.', 'It matters.', null, $proposer)->id,
            'chat.message' => $this->postTo(
                $this->inboxOf(ActorIdentity::of($caller->agent)),
                $caller->agent,
                'Use the violet harbor.',
            )->id,
            'documents.document' => $this->callMcpTool($caller, 'docs_create', [
                'title' => 'Dispatch guide',
                'abstract' => 'Safe dispatch.',
                'body' => "# Guide\nStart again from the violet harbor.",
                'request_key' => 'search-document',
            ])->json('result.structuredContent.document_id'),
            'documents.report' => $this->callMcpTool($caller, 'reports_create', [
                'title' => 'Violet harbor check',
                'abstract' => 'What was checked.',
                'body' => "# Check\nAll clear.",
                'request_key' => 'search-report',
            ])->json('result.structuredContent.record_id'),
        ];

        foreach ($records as $within => $id) {
            $hits = $this->callMcpTool($caller, 'search', ['query' => 'violet harbor', 'within' => $within])
                ->assertJsonPath('result.isError', false)
                ->json('result.structuredContent.hits');

            $this->assertContains($id, array_map(fn (array $hit): string => $hit['reference']['id'], $hits), $within);
        }
    }
}
