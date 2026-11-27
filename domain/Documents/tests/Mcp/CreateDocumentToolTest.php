<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Mcp;

use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\DocumentsDomain;
use Domain\Documents\Mcp\Tools\CreateDocumentTool;
use Domain\Documents\Values\CreatedRecord;
use Illuminate\Support\Str;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent writes a document with a title, an abstract and a body, and is given its number.
 */
#[TestsMcpTool(CreateDocumentTool::class)]
final class CreateDocumentToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(DocumentsDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        $start = $journal->owner()->signedStart('Writer');

        return ToolCall::by($start)
            ->arguments([
                'title' => 'Design',
                'abstract' => 'The plan.',
                'body' => '# Design',
                'request_key' => 'documents-1',
            ])
            ->reply(
                CreateDocumentCommand::class,
                new CreatedRecord(strtolower((string) Str::ulid()), 7, 'documents.document'),
            )
            ->expects(CreateDocumentCommand::class, [
                'title' => 'Design',
                'abstract' => 'The plan.',
                'body' => '# Design',
            ]);
    }
}
