<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Mcp;

use Domain\Documents\Commands\CreateReport\CreateReportCommand;
use Domain\Documents\DocumentsDomain;
use Domain\Documents\Mcp\Tools\ReadReportTool;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent reads a report.
 */
#[TestsMcpTool(ReadReportTool::class)]
final class ReadReportToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(DocumentsDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        $start = $journal->owner()->signedStart('Writer');
        $report = $journal->runAs('Writer', new CreateReportCommand('Trace', 'The cause.', "# Trace\nFound it."));

        return ToolCall::by($start)->arguments(['report_id' => $report->number]);
    }
}
