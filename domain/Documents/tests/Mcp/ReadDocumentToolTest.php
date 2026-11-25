<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Mcp;

use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\DocumentsDomain;
use Domain\Documents\Mcp\Tools\ReadDocumentTool;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent reads a document.
 */
#[TestsMcpTool(ReadDocumentTool::class)]
final class ReadDocumentToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(DocumentsDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        $start = $journal->owner()->signedStart('Writer');
        $document = $journal->runAs('Writer', new CreateDocumentCommand('Design', 'The plan.', "# Design\nText."));

        return ToolCall::by($start)->arguments(['doc_id' => $document->number]);
    }
}
