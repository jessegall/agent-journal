<?php

declare(strict_types=1);

namespace Domain\Questions\Tests\Mcp;

use Domain\Questions\Mcp\Tools\QuestionReadTool;
use Domain\Questions\QuestionsDomain;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of the tool QuestionReadTool, as the generator wrote it.
 */
#[Generated]
#[TestsMcpTool(QuestionReadTool::class)]
final class QuestionReadToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(QuestionsDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        throw EntryTestNeedsArrangement::for('QuestionReadTool', [
            'the argument question_id',
            'the argument request_key',
            'the expected commands',
            'the sink replies',
        ]);
    }
}
