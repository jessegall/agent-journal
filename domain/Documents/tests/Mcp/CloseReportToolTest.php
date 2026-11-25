<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Mcp;

use Domain\Documents\Commands\CloseReport\CloseReportCommand;
use Domain\Documents\Commands\CreateReport\CreateReportCommand;
use Domain\Documents\DocumentsDomain;
use Domain\Documents\Mcp\Tools\CloseReportTool;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent closes a report with the reason it needs no action.
 */
#[TestsMcpTool(CloseReportTool::class)]
final class CloseReportToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(DocumentsDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        $start = $journal->owner()->signedStart('Writer');
        $report = $journal->runAs('Writer', new CreateReportCommand('Trace', 'The cause.', "# Trace\nFound it."));

        return ToolCall::by($start)
            ->arguments([
                'report_id' => $report->number,
                'reason' => 'Fixed in task 12.',
                'request_key' => 'documents-1',
            ])
            ->expects(CloseReportCommand::class, [
                'reportReference' => (string) $report->number,
                'reason' => 'Fixed in task 12.',
            ]);
    }
}
