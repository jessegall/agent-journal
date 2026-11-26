<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Mcp;

use Domain\Documents\Commands\CloseDocument\CloseDocumentCommand;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\Commands\OpenDocument\OpenDocumentCommand;
use Domain\Documents\DocumentsDomain;
use Domain\Documents\Mcp\Tools\CloseDocumentTool;
use Domain\Documents\Values\CloseResult;
use Domain\Documents\Values\DraftTarget;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\TestProjects;

/**
 * An agent closes its open draft into the next revision.
 */
#[TestsMcpTool(CloseDocumentTool::class)]
final class CloseDocumentToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(DocumentsDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        $start = $journal->owner()->signedStart('Writer');
        $document = $journal->runAs('Writer', new CreateDocumentCommand('Design', 'The plan.', "# Design\nText.", TestProjects::local()->id));
        $opened = $journal->runAs('Writer', new OpenDocumentCommand((string) $document->number));

        return ToolCall::by($start)
            ->arguments(['doc_id' => $document->number, 'edit_id' => $opened->token, 'request_key' => 'documents-1'])
            ->reply(CloseDocumentCommand::class, new CloseResult(2, true))
            ->expects(CloseDocumentCommand::class, ['draft' => new DraftTarget((string) $document->number, $opened->token, null)]);
    }
}
