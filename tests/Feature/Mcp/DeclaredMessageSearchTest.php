<?php

declare(strict_types=1);

namespace Tests\Feature\Mcp;

use App\Support\ActorIdentity;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\SendsMcpFrames;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WritesInboxMessages;
use Tests\TestCase;

/**
 * A participant's search within chat.message finds only the messages it may see, a hidden
 * message's words give no hit, and opening a hit rechecks the message's current visibility.
 */
#[TimeLimit(5, 'Each case sends several signed MCP calls.')]
final class DeclaredMessageSearchTest extends TestCase
{
    use CommitsHookRows;
    use SendsMcpFrames;
    use WritesInboxMessages;

    private const array TABLES = [
        'agents', 'agent_sessions', 'session_tokens', 'agent_stacks', 'command_receipts', 'number_groups', 'links',
        'inboxes', 'desks', 'desk_seats', 'desk_preferences', 'assignments', 'messages', 'message_attentions',
    ];

    public function test_only_visible_messages_match_and_opening_rechecks_visibility(): void
    {
        $caller = TestStart::start();
        $other = TestStart::start();
        $visible = $this->askInboxOf(ActorIdentity::of($caller->agent), "A note.\nUse the violet harbor.");
        $hidden = $this->askInboxOf(ActorIdentity::of($other->agent), 'Private violet harbor coordinates.');

        $hits = $this->callMcpTool($caller, 'search', ['query' => 'violet harbor', 'within' => 'chat.message'])
            ->assertJsonPath('result.isError', false)
            ->json('result.structuredContent.hits');
        $ids = array_map(fn (array $hit): string => $hit['reference']['id'], $hits);

        $this->assertSame([$visible->id], $ids);
        $this->assertNotContains($hidden->id, $ids);

        $open = $hits[0]['open'];
        $this->callMcpTool($caller, $open['tool'], $open['arguments'])->assertJsonPath('result.isError', false);
        $this->callMcpTool($other, $open['tool'], $open['arguments'])->assertJsonPath('result.isError', true);
    }
}
