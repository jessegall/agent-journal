<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Mcp;

use Domain\Documents\DocumentsDomain;
use Domain\Documents\Mcp\Tools\DocumentsListTool;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of the tool DocumentsListTool, as the generator wrote it.
 */
#[Generated]
#[TestsMcpTool(DocumentsListTool::class)]
final class DocumentsListToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(DocumentsDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        return ToolCall::by($journal->owner()->signedStart('Agent'));
    }
}
