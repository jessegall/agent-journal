<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Contracts\Authorization\CurrentAuthorizer;
use App\Enums\Agents\AccessType;
use App\Enums\Drivers\RewriteSupport;
use App\Enums\Hooks\ContextStartType;
use App\Mcp\Support\McpInstructions;
use App\Support\Drivers\DriverCapabilities;
use App\Support\Inputs\SessionStarted;
use App\Support\Inputs\Values\SessionStartDetails;
use Tests\Fixtures\Actors\FixedCurrentAuthorizer;
use Tests\Support\CommittedHookStack;
use Tests\Support\TestActors;
use Tests\Support\TestText;
use Tests\TestCase;

/**
 * A started agent's start context tells it once to use the journal MCP tools, and lists only the CLI and web
 * flowsOutsideMcp its role has.
 */
final class McpInstructionsTest extends TestCase
{
    use CommittedHookStack;

    private const string MCP_ADVICE = 'Use the journal MCP tools';

    private const string ACCOUNT_JOURNEY = 'account work (the Accounts page)';

    private const string SEQUENCE_JOURNEY = 'sequences (journal sequence)';

    private const string ACCOUNT_WORK = 'account work';

    public function test_a_main_agents_start_context_holds_the_instructions_once(): void
    {
        $context = $this->startAs();

        $this->assertSame(
            1,
            count(
                array_filter($context, fn (string $line): bool => str_starts_with($line, self::MCP_ADVICE)),
            ),
        );
        $this->assertStringContainsString(self::ACCOUNT_JOURNEY, implode("\n", $context));
    }

    public function test_a_reviewer_hears_only_its_own_flows(): void
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

    /**
     * @return list<string>
     */
    private function startAs(): array
    {
        $this->app->instance(CurrentAuthorizer::class, new FixedCurrentAuthorizer([AccessType::Delegate]));
        $start = new SessionStarted(
            TestActors::hookIdentity(1, 10, 'call-1', hash('sha256', 'call-1')),
            new SessionStartDetails('native-1', ContextStartType::Start, null),
        );
        $capabilities = new DriverCapabilities(
            'Test driver',
            'session starts',
            ['onSessionStart'],
            RewriteSupport::WithoutApproval,
        );

        return $this->journal->answerHook($this->target, $start, $capabilities)->context;
    }
}
