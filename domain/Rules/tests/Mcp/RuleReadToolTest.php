<?php

declare(strict_types=1);

namespace Domain\Rules\Tests\Mcp;

use Domain\Rules\Mcp\Tools\RuleReadTool;
use Domain\Rules\RulesDomain;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of the tool RuleReadTool, as the generator wrote it.
 */
#[Generated]
#[TestsMcpTool(RuleReadTool::class)]
final class RuleReadToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(RulesDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        throw EntryTestNeedsArrangement::for('RuleReadTool', [
            'the argument rule_id',
        ]);
    }
}
