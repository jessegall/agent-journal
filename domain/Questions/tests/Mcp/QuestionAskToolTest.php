<?php

declare(strict_types=1);

namespace Domain\Questions\Tests\Mcp;

use Domain\Questions\Mcp\Tools\QuestionAskTool;
use Domain\Questions\QuestionsDomain;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of the tool QuestionAskTool, as the generator wrote it.
 */
#[Generated]
#[TestsMcpTool(QuestionAskTool::class)]
final class QuestionAskToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(QuestionsDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        throw EntryTestNeedsArrangement::for('QuestionAskTool', [
            'the argument inbox_id',
            'the argument target_type',
            'the argument target_id',
            'the argument text',
            'the argument type',
            'the argument request_key',
            'the expected commands',
            'the sink replies',
        ]);
    }
}
