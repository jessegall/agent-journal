<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Mcp;

use Domain\Documents\DocumentsDomain;
use Domain\Documents\Mcp\Tools\ReadDocumentTool;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of the tool ReadDocumentTool, as the generator wrote it.
 */
#[Generated]
#[TestsMcpTool(ReadDocumentTool::class)]
final class ReadDocumentToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(DocumentsDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        throw EntryTestNeedsArrangement::for('ReadDocumentTool', [
            'the argument doc_id',
        ]);
    }
}
