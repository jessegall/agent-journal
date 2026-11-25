<?php

declare(strict_types=1);

namespace Domain\Rules\Tests\Mcp;

use Domain\Rules\Mcp\Tools\ProposeRuleTool;
use Domain\Rules\RulesDomain;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of the tool ProposeRuleTool, as the generator wrote it.
 */
#[Generated]
#[TestsMcpTool(ProposeRuleTool::class)]
final class ProposeRuleToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(RulesDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        throw EntryTestNeedsArrangement::for('ProposeRuleTool', [
            'the argument text',
            'the argument reason',
            'the argument request_key',
            'the expected commands',
            'the sink replies',
        ]);
    }
}
