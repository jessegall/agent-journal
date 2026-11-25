<?php

declare(strict_types=1);

namespace Tests\Feature\Mcp;

use App\Support\ActorIdentity;
use Domain\Chat\ChatDomain;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
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
    use WritesInboxMessages;

    private const array TABLES = [
        'agents', 'agent_sessions', 'session_tokens', 'agent_stacks', 'command_receipts', 'number_groups', 'links',
        'inboxes', 'inbox_members', 'assignments', 'messages',
    ];

    /**
     * The domains whose tools this test calls.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(ChatDomain::class);
    }

    public function test_only_visible_messages_match_and_opening_rechecks_visibility(): void
    {
        $caller = TestStart::start();
        $other = TestStart::start();
        $visible = $this->postTo(
            $this->inboxOf(ActorIdentity::of($caller->agent)),
            $caller->agent,
            "A note.\nUse the violet harbor.",
        );
        $hidden = $this->postTo(
            $this->inboxOf(ActorIdentity::of($other->agent)),
            $other->agent,
            'Private violet harbor coordinates.',
        );

        $hits = $this->journal->mcpTool(
            $caller,
            'search',
            ['query' => 'violet harbor', 'within' => 'chat.message'],
        )->assertOk()
            ->assertJsonPath('result.isError', false)
            ->json('result.structuredContent.hits');
        $ids = array_map(fn (array $hit): string => $hit['reference']['id'], $hits);

        $this->assertSame([$visible->id], $ids);
        $this->assertNotContains($hidden->id, $ids);

        $open = $hits[0]['open'];
        $this->journal->mcpTool(
            $caller,
            $open['tool'],
            $open['arguments'],
        )->assertOk()->assertJsonPath('result.isError', false);
        $this->journal->mcpTool(
            $other,
            $open['tool'],
            $open['arguments'],
        )->assertOk()->assertJsonPath('result.isError', true);
    }
}
