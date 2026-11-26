<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Mcp;

use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\Commands\EditDocument\EditDocumentCommand;
use Domain\Documents\Commands\OpenDocument\OpenDocumentCommand;
use Domain\Documents\DocumentsDomain;
use Domain\Documents\Mcp\Tools\EditDocumentTool;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\TestProjects;

/**
 * An agent replaces one section of its open draft.
 */
#[TestsMcpTool(EditDocumentTool::class)]
final class EditDocumentToolTest extends McpToolEntryTestCase
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
            ->arguments([
                'doc_id' => $document->number,
                'edit_id' => $opened->token,
                'expected_revision' => $opened->version,
                'section' => '1',
                'body' => 'New text.',
                'request_key' => 'documents-1',
            ])
            ->reply(EditDocumentCommand::class, $opened)
            ->expects(EditDocumentCommand::class, ['section' => '1', 'body' => 'New text.']);
    }
}
