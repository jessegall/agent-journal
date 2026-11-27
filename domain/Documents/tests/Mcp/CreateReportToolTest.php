<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Mcp;

use Domain\Documents\Commands\CreateReport\CreateReportCommand;
use Domain\Documents\DocumentsDomain;
use Domain\Documents\Mcp\Tools\CreateReportTool;
use Domain\Documents\Values\CreatedRecord;
use Illuminate\Support\Str;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent files a report with a title, an abstract and a body, and is given its number.
 */
#[TestsMcpTool(CreateReportTool::class)]
final class CreateReportToolTest extends McpToolEntryTestCase
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
                'title' => 'Trace',
                'abstract' => 'The cause.',
                'body' => '# Trace',
                'request_key' => 'documents-1',
            ])
            ->reply(
                CreateReportCommand::class,
                new CreatedRecord(strtolower((string) Str::ulid()), 3, 'documents.report'),
            )
            ->expects(CreateReportCommand::class, [
                'title' => 'Trace',
                'abstract' => 'The cause.',
                'body' => '# Trace',
            ]);
    }
}
