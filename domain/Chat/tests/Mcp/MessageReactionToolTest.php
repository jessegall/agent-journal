<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Mcp;

use Domain\Chat\ChatDomain;
use Domain\Chat\Commands\React\ReactCommand;
use Domain\Chat\Mcp\Tools\MessageReactionTool;
use Domain\Chat\Tests\Fixtures\ChatFixtures;
use Illuminate\Support\Str;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent reacts with one emoji to a message in its chat with the owner.
 */
#[TestsMcpTool(MessageReactionTool::class)]
final class MessageReactionToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(ChatDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        $start = $journal->owner()->signedStart('Builder');
        $chats = $journal->fixtures(ChatFixtures::class)->pairChatBetween('Owner', 'Builder');
        $message = $journal->post('Owner', $chats->pairChatOf('Owner', 'Builder'), 'The build is green.');

        return ToolCall::by($start)
            ->arguments([
                'message_id' => $message->id,
                'emoji' => '👍',
                'request_key' => 'react-1',
            ])
            ->reply(ReactCommand::class, Str::ulid())
            ->expects(ReactCommand::class, [
                'messageId' => $message->id,
                'emoji' => '👍',
            ]);
    }
}
