<?php

declare(strict_types=1);

namespace Tests\Machinery\Agents;

use App\Enums\Agents\AccessType;
use App\Mcp\Support\McpInstructions;
use Tests\Fixtures\Actors\FixedCurrentAuthorizer;
use Tests\Support\CommittedHookStack;
use Tests\Support\TestText;
use Tests\TestCase;

/**
 * A started agent's start context tells it once to use the journal MCP tools, and lists only the CLI and web
 * flowsOutsideMcp its role has.
 */
final class McpInstructionsTest extends TestCase
{
    use CommittedHookStack;

    private const string SEQUENCE_JOURNEY = 'sequences (journal sequence)';

    private const string ACCOUNT_WORK = 'account work';

    public function test_a_reviewer_receives_only_its_own_flows(): void
    {
        $instructions = TestText::words(new McpInstructions(new FixedCurrentAuthorizer())->forCaller());

        $this->assertStringContainsString(self::SEQUENCE_JOURNEY, $instructions);
        $this->assertStringNotContainsString(self::ACCOUNT_WORK, $instructions);
    }

    public function test_the_instructions_stay_short_and_name_no_token_or_path(): void
    {
        foreach ([[], [AccessType::Delegate]] as $granted) {
            $instructions = TestText::words(new McpInstructions(new FixedCurrentAuthorizer($granted))->forCaller());

            $this->assertLessThan(1500, mb_strlen($instructions));
            $this->assertStringNotContainsString(
                '/',
                str_replace(['journal output, journal reader'], '', $instructions),
            );
            $this->assertStringNotContainsStringIgnoringCase('token', $instructions);
        }
    }
}
