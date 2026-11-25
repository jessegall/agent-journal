<?php

declare(strict_types=1);

namespace Domain\Rules\Tests\Mcp;

use Domain\Rules\Mcp\Tools\RulesListTool;
use Domain\Rules\RulesDomain;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of the tool RulesListTool, as the generator wrote it.
 */
#[Generated]
#[TestsMcpTool(RulesListTool::class)]
final class RulesListToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(RulesDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        return ToolCall::by($journal->owner()->signedStart('Agent'));
    }
}
