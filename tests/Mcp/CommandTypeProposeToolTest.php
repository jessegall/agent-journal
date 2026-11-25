<?php

declare(strict_types=1);

namespace Tests\Mcp;

use App\Commands\CommandRules\ProposeRuleDeclaration\ProposeRuleDeclarationCommand;
use App\Mcp\Tools\CommandTypeProposeTool;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Processes\HoldsCommandRequests;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent proposes a rule for its held line from a declaration file: the tool sends the one propose command and shows the proposal it made.
 */
#[TestsMcpTool(CommandTypeProposeTool::class)]
final class CommandTypeProposeToolTest extends McpToolEntryTestCase
{
    use HoldsCommandRequests;

    protected function arrange(TestJournal $journal): ToolCall
    {
        $start = $journal->owner()->signedStart('Runner');
        $request = $this->heldRequest($journal, $start);
        $file = $this->declarationFile('propose-1');
        $receipt = $journal->runAsStart($start, new ProposeRuleDeclarationCommand($request, $file));

        return ToolCall::by($start)
            ->arguments(['request' => $request, 'declaration_file' => $file, 'request_key' => 'propose-2'])
            ->reply(ProposeRuleDeclarationCommand::class, $receipt)
            ->expects(ProposeRuleDeclarationCommand::class, [
                'commandRequestId' => $request,
                'declarationFile' => $file,
            ]);
    }
}
