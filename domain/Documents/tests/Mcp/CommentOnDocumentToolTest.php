<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Mcp;

use Domain\Documents\Commands\CommentOnDocument\CommentOnDocumentCommand;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\DocumentsDomain;
use Domain\Documents\Mcp\Tools\CommentOnDocumentTool;
use Illuminate\Support\Str;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\TestProjects;

/**
 * An agent comments on a document and is given the comment.
 */
#[TestsMcpTool(CommentOnDocumentTool::class)]
final class CommentOnDocumentToolTest extends McpToolEntryTestCase
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
            ->arguments([
                'doc_id' => $document->number,
                'body' => 'Section two is unclear.',
                'request_key' => 'documents-1',
            ])
            ->reply(CommentOnDocumentCommand::class, Str::ulid())
            ->expects(CommentOnDocumentCommand::class, [
                'documentId' => (string) $document->number,
                'body' => 'Section two is unclear.',
            ]);
    }
}
