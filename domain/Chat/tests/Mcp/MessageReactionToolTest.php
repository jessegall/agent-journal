<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Mcp;

use Domain\Chat\ChatDomain;
use Domain\Chat\Mcp\Tools\MessageReactionTool;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of the tool MessageReactionTool, as the generator wrote it.
 */
#[Generated]
#[TestsMcpTool(MessageReactionTool::class)]
final class MessageReactionToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(ChatDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        throw EntryTestNeedsArrangement::for('MessageReactionTool', [
            'the argument message_id',
            'the argument emoji',
            'the argument request_key',
            'the expected commands',
            'the sink replies',
        ]);
    }
}
