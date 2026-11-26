<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Mcp;

use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\Commands\OpenDocument\OpenDocumentCommand;
use Domain\Documents\DocumentsDomain;
use Domain\Documents\Mcp\Tools\OpenDocumentTool;
use Domain\Documents\Values\DraftReference;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\TestProjects;

/**
 * An agent opens a draft of a document at the revision it read.
 */
#[TestsMcpTool(OpenDocumentTool::class)]
final class OpenDocumentToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(DocumentsDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        $start = $journal->owner()->signedStart('Writer');
        $document = $journal->runAs('Writer', new CreateDocumentCommand('Design', 'The plan.', "# Design\nText.", TestProjects::local()->id));

        return ToolCall::by($start)
            ->arguments(['doc_id' => $document->number, 'expected_revision' => 1, 'request_key' => 'documents-1'])
            ->reply(OpenDocumentCommand::class, new DraftReference($document->id, $document->number, 'edit-1', 1, 1, ['# Design']))
            ->expects(OpenDocumentCommand::class, [
                'documentNumber' => (string) $document->number,
                'expectedRevision' => 1,
            ]);
    }
}
