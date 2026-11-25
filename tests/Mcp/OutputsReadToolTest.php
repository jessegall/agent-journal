<?php

declare(strict_types=1);

namespace Tests\Mcp;

use App\Api\Processes\OutputTail;
use App\Commands\Runs\ReadOutputTail\ReadOutputTailCommand;
use App\Enums\Processes\OutputStream;
use App\Mcp\Tools\OutputsReadTool;
use App\Values\PartKey;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent reads the last lines of its own run's output through the command that also records the range it read.
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
            ->arguments(['run' => $run->id, 'part' => 1, 'stream' => 'stdout', 'request_key' => 'read-1'])
            ->reply(ReadOutputTailCommand::class, new OutputTail('diagnostic output', 'stdout', "done\n", 0, 5))
            ->expects(ReadOutputTailCommand::class, [
                'processRunId' => $run->id,
                'part' => 1,
                'stream' => OutputStream::Stdout,
                'lines' => 200,
            ]);
    }
}
