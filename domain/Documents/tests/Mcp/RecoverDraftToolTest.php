<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Mcp;

use App\Support\ActorReference;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\Commands\OpenDocument\OpenDocumentCommand;
use Domain\Documents\Commands\RecoverDraft\RecoverDraftCommand;
use Domain\Documents\DocumentsDomain;
use Domain\Documents\Mcp\Tools\RecoverDraftTool;
use Domain\Documents\Models\DocumentDraft;
use Domain\Documents\Models\RetainedDraft;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * A parent agent recovers a draft kept when its helper ended, into a draft of its own.
 */
#[TestsMcpTool(RecoverDraftTool::class)]
final class RecoverDraftToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(DocumentsDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        $start = $journal->owner()->signedStart('Writer');
        $document = $journal->runAs('Writer', new CreateDocumentCommand('Design', 'The plan.', "# Design\nText."));
        $opened = $journal->runAs('Writer', new OpenDocumentCommand((string) $document->number));

        $retained = RetainedDraft::create(
            DocumentDraft::query()->where('document_id', $document->id)->sole(),
            'The session ended.',
            ActorReference::of($start->agent),
        );

        return ToolCall::by($start)
            ->arguments([
                'draft_id' => $retained->id,
                'expected_revision' => 1,
                'request_key' => 'documents-1',
            ])
            ->reply(RecoverDraftCommand::class, $opened)
            ->expects(RecoverDraftCommand::class, [
                'draftId' => $retained->id,
                'expectedRevision' => 1,
            ]);
    }
}
