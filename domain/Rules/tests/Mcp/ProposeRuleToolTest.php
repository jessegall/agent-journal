<?php

declare(strict_types=1);

namespace Domain\Rules\Tests\Mcp;

use Domain\Rules\Commands\ProposeRule\ProposeRuleCommand;
use Domain\Rules\Mcp\Tools\ProposeRuleTool;
use Domain\Rules\RulesDomain;
use Illuminate\Support\Str;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * A main agent proposes a rule with its reason and is given the proposal.
 */
#[TestsMcpTool(ProposeRuleTool::class)]
final class ProposeRuleToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(RulesDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        $start = $journal->owner()->signedStart('Builder');

        return ToolCall::by($start)
            ->arguments([
                'text' => 'Run the phase tests once.',
                'reason' => 'User 24714.',
                'request_key' => 'write-1',
            ])
            ->reply(ProposeRuleCommand::class, (string) Str::ulid())
            ->expects(ProposeRuleCommand::class, [
                'text' => 'Run the phase tests once.',
                'reason' => 'User 24714.',
            ]);
    }
}
