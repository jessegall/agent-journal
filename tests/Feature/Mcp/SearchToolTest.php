<?php

declare(strict_types=1);

namespace Tests\Feature\Mcp;

use App\Actors\Support\ActorIdentity;
use Domain\Tasks\Models\Task;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\SendsMcpFrames;
use Tests\Support\WritesInboxMessages;
use Tests\TestCase;

final class SearchToolTest extends TestCase
{
    use CommitsHookRows;
    use SendsMcpFrames;
    use WritesInboxMessages;

    private const array TABLES = [
        'agents', 'agent_sessions', 'start_tokens', 'agent_stacks', 'command_receipts', 'number_groups', 'links',
        'tasks', 'plans', 'phases', 'phase_tasks', 'rules', 'documents', 'document_revisions', 'reports',
        'inboxes', 'desks', 'desk_seats', 'desk_preferences', 'assignments', 'messages', 'message_attentions',
    ];

    public function test_search_finds_matches_by_area_and_never_returns_a_private_message_from_another_inbox(): void
    {
        $caller = TestStart::start();
        $other = TestStart::start();
        $task = Task::factory()->create(['title' => 'Check the violet harbor']);
        $message = $this->askInboxOf(ActorIdentity::of($caller->agent), "A note.\nUse the violet harbor.");
        $hidden = $this->askInboxOf(ActorIdentity::of($other->agent), 'Private violet harbor coordinates.');
        $document = $this->callMcpTool($caller, 'docs_create', [
            'title' => 'Dispatch guide',
            'abstract' => 'Safe dispatch instructions.',
            'body' => "# Guide\nStart again from the violet harbor.",
            'request_key' => 'search-document',
        ])->assertJsonPath('result.isError', false)->json('result.structuredContent.document_id');

        $answer = $this->callMcpTool($caller, 'search', [
            'query' => 'violet harbor',
            'types' => ['tasks.task', 'chat.message', 'documents.document', 'unknown.area'],
        ])->assertJsonPath('result.isError', false)->json('result.structuredContent');

        $this->assertSame(['unknown.area'], $answer['unavailable_types']);
        $this->assertSame([
            'tasks.task' => $task->id, 'chat.message' => $message->id, 'documents.document' => $document,
        ], array_column($answer['hits'], 'id', 'type'));
        $this->assertNotContains($hidden->id, array_column($answer['hits'], 'id'));
        foreach ($answer['hits'] as $hit) {
            $this->assertStringContainsString('violet harbor', $hit['excerpt']);
            $this->assertLessThanOrEqual(200, mb_strlen($hit['excerpt']));
        }
    }

    public function test_search_continues_only_the_type_that_has_more_results(): void
    {
        $caller = TestStart::start();
        Task::factory()->count(3)->create(['title' => 'Temporary runway']);
        $first = $this->callMcpTool($caller, 'search', [
            'query' => 'runway', 'types' => ['tasks.task', 'chat.message'],
        ])->assertJsonPath('result.structuredContent.types_with_more', ['tasks.task'])->json('result.structuredContent');
        $next = $first['next_actions'][0];

        $second = $this->callMcpTool($caller, $next['tool'], $next['arguments'])
            ->assertJsonPath('result.isError', false)->json('result.structuredContent');
        $this->assertCount(2, $first['hits']);
        $this->assertCount(1, $second['hits']);
        $this->assertSame('tasks.task', $second['hits'][0]['type']);
        $this->assertNotContains($second['hits'][0]['id'], array_column($first['hits'], 'id'));
    }
}
