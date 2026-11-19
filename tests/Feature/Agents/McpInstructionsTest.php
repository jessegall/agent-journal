<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Actors\Contracts\CurrentAuthorizer;
use App\AgentRequests\Support\SignedCall;
use App\Agents\Enums\AgentRole;
use App\Agents\Support\AgentContext;
use App\Assignments\Enums\AssignmentAbility;
use App\Bus\Support\OperationDeadline;
use App\Hooks\Enums\RewriteSupport;
use App\Hooks\Enums\SessionStartSource;
use App\Hooks\Inputs\HookIdentity;
use App\Hooks\Inputs\SessionStartDetails;
use App\Hooks\Inputs\SessionStarted;
use App\Hooks\Programs\ProgramCapabilities;
use App\Hooks\Programs\ProgramReply;
use App\Hooks\Stack\HookAnswer;
use App\Mcp\Support\McpInstructions;
use Carbon\CarbonImmutable;
use Tests\Fixtures\Actors\FixedCurrentAuthorizer;
use Tests\Support\CommittedHookStack;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * A launched agent's start context tells it once to use the journal MCP tools, and lists only the CLI and web
 * journeys its role has.
 */
final class McpInstructionsTest extends TestCase
{
    use CommittedHookStack;

    public function test_a_main_agents_start_context_holds_the_instructions_once(): void
    {
        $context = $this->startAs(AgentRole::MainAgent);

        $this->assertSame(1, count(array_filter($context, fn (string $line): bool => str_starts_with($line, 'Use the journal MCP tools'))));
        $this->assertStringContainsString('helper dispatch (journal helper)', implode("\n", $context));
    }

    public function test_a_reviewer_hears_only_its_own_journeys(): void
    {
        $instructions = new McpInstructions(new FixedCurrentAuthorizer())->forCaller();

        $this->assertStringContainsString('sequences (journal sequence)', $instructions);
        $this->assertStringNotContainsString('helper dispatch', $instructions);
        $this->assertStringNotContainsString('reminders', $instructions);
    }

    public function test_the_instructions_stay_short_and_name_no_token_or_path(): void
    {
        foreach ([[], [AssignmentAbility::Dispatch]] as $granted) {
            $instructions = new McpInstructions(new FixedCurrentAuthorizer($granted))->forCaller();

            $this->assertLessThan(1500, mb_strlen($instructions));
            $this->assertStringNotContainsString('/', str_replace(['journal output, journal reader'], '', $instructions));
            $this->assertStringNotContainsStringIgnoringCase('token', $instructions);
        }
    }

    /**
     * @return list<string>
     */
    private function startAs(AgentRole $role): array
    {
        $this->callAs('call-1', hash('sha256', 'call-1'));
        $this->app->instance(CurrentAuthorizer::class, new FixedCurrentAuthorizer([AssignmentAbility::Dispatch]));
        $this->app->instance(AgentContext::class, new AgentContext(TestIds::of(1), TestIds::of(10), $role->value, new SignedCall('call-1', CarbonImmutable::now(), hash('sha256', 'call-1')), null));
        $start = new SessionStarted(new HookIdentity(TestIds::of(1), TestIds::of(10), 'call-1', hash('sha256', 'call-1')), new SessionStartDetails('native-1', SessionStartSource::Startup));
        $capabilities = new ProgramCapabilities('Test program', 'session starts', ['onSessionStart'], RewriteSupport::WithoutApproval);

        $reply = $this->machine()->answer($start, $capabilities, new OperationDeadline(3000), fn (HookAnswer $answer) => new ProgramReply((string) json_encode($answer->context), '', 0));

        return json_decode($reply->stdout, true, flags: JSON_THROW_ON_ERROR);
    }
}
