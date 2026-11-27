<?php

declare(strict_types=1);

namespace Domain\Rules\Tests\Mcp;

use Domain\Rules\Mcp\Tools\RuleReadTool;
use Domain\Rules\RulesDomain;
use Domain\Rules\Tests\Fixtures\RuleFixtures;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent reads one rule with what it replaces.
 */
#[TestsMcpTool(RuleReadTool::class)]
final class RuleReadToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(RulesDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        $start = $journal->owner()->signedStart('Builder');

        $rule = $journal->fixtures(RuleFixtures::class)->proposedRule(
            'Tests',
            'Run the phase tests once.',
            'Builder',
        )->ruleCalled('Tests');

        return ToolCall::by($start)->arguments(['rule_id' => $rule->id]);
    }
}
