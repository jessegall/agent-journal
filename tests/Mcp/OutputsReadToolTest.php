<?php

declare(strict_types=1);

namespace Tests\Mcp;

use App\Commands\CommandRules\RecordEvidenceReads\RecordEvidenceReadsCommand;
use App\Mcp\Tools\OutputsReadTool;
use App\Values\PartKey;
use Tests\Support\Bus\ExpectedCommand;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent reads the last lines of its own run's output, and the range it read is recorded by the one evidence command.
 */
#[TestsMcpTool(OutputsReadTool::class)]
final class OutputsReadToolTest extends McpToolEntryTestCase
{
    protected function arrange(TestJournal $journal): ToolCall
    {
        $start = $journal->owner()->signedStart('Runner');
        $run = $journal->actAs('Runner')
            ->processRun('Read', 'cat composer.json')
            ->runningPart('Read', new PartKey(1, 1, 'cat'))
            ->processRunCalled('Read');

        return ToolCall::by($start)
            ->arguments(['run' => $run->id, 'part' => 1, 'stream' => 'stdout'])
            ->reply(RecordEvidenceReadsCommand::class, 1)
            ->expects(ExpectedCommand::of(RecordEvidenceReadsCommand::class, ['processRunId' => $run->id]));
    }
}
