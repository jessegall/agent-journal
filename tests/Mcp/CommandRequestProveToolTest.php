<?php

declare(strict_types=1);

namespace Tests\Mcp;

use App\CommandRules\Commands\ProveReader\ProveReaderCommand;
use App\CommandRules\Mcp\Tools\CommandRequestProveTool;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Processes\HoldsCommandRequests;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent proves a reader on its runs: the tool sends the one prove command and names the proof it made.
 */
#[TestsMcpTool(CommandRequestProveTool::class)]
final class CommandRequestProveToolTest extends McpToolEntryTestCase
{
    use HoldsCommandRequests;

    protected function arrange(TestJournal $journal): ToolCall
    {
        $start = $journal->owner()->signedStart('Runner');
        $request = $this->heldRequest($journal, $start);
        $run = strtolower((string) Str::ulid());

        return ToolCall::by($start)
            ->arguments(['request' => $request, 'reader_revision' => 'reader-1', 'runs' => [$run], 'request_key' => 'prove-1'])
            ->reply(ProveReaderCommand::class, Str::ulid())
            ->expects(ProveReaderCommand::class, [
                'commandRequestId' => $request,
                'readerRevisionId' => 'reader-1',
                'runIds' => [$run],
            ]);
    }
}
