<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Mcp;

use Domain\Documents\Commands\CommentOnReport\CommentOnReportCommand;
use Domain\Documents\Commands\CreateReport\CreateReportCommand;
use Domain\Documents\DocumentsDomain;
use Domain\Documents\Mcp\Tools\CommentOnReportTool;
use Illuminate\Support\Str;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\TestProjects;

/**
 * An agent comments on a report and is given the comment.
 */
#[TestsMcpTool(CommentOnReportTool::class)]
final class CommentOnReportToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(DocumentsDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        $start = $journal->owner()->signedStart('Writer');

        $report = $journal->runAs(
            'Writer',
            new CreateReportCommand('Trace', 'The cause.', "# Trace\nFound it.", TestProjects::local()->id),
        );

        return ToolCall::by($start)
            ->arguments(['report_id' => $report->number, 'body' => 'Confirmed.', 'request_key' => 'documents-1'])
            ->reply(CommentOnReportCommand::class, Str::ulid())
            ->expects(CommentOnReportCommand::class, ['reportId' => (string) $report->number, 'body' => 'Confirmed.']);
    }
}
