<?php

declare(strict_types=1);

namespace Tests\Commands\CommandRules;

use App\Commands\CommandRules\OpenCommandRequest\OpenCommandRequestCommand;
use App\Enums\CommandRules\RequestHoldReason;
use App\Enums\CommandRules\RequestStatus;
use App\Models\CommandRules\CommandRequest;
use Tests\Support\ActsAsActors;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * An agent opens a request for an unknown command: opening twice gives the same request with its propose step, another
 * project or agent gets its own, and a fresh read gives the same state and next step.
 */
final class OpenCommandRequestTest extends TestCase
{
    use ActsAsActors;
    use RefreshHookDatabase;

    private const string PROPOSE_STEP = 'the command_types_propose tool with request %s';

    private const string APPROVE_STEP = "waiting for the owner to approve request %s's sample";

    public function test_opening_twice_returns_the_same_request_with_its_propose_step(): void
    {
        $first = $this->open('agent-1', '/projects/acme');
        $second = $this->open('agent-1', '/projects/acme');

        $request = CommandRequest::query()->findOrFail($first);
        $this->assertSame($first, $second);
        $this->assertSame(RequestStatus::CollectingDeclaration, $request->status);
        $this->assertStringStartsWith(sprintf(self::PROPOSE_STEP, $first), $request->nextStep->command);
    }

    public function test_another_project_or_another_agent_gets_its_own_request(): void
    {
        $first = $this->open('agent-1', '/projects/acme');
        $this->assertNotSame($first, $this->open('agent-2', '/projects/acme'));

        config(['processes.project_key' => 'other-project']);

        $this->assertNotSame($first, $this->open('agent-1', '/projects/acme'));
        $other = CommandRequest::query()->findOrFail($this->open('agent-1', '/projects/acme'));
        $this->assertSame('other-project', $other->project_key);
    }

    public function test_a_fresh_read_gives_the_same_state_and_next_step(): void
    {
        $first = $this->open('agent-1', '/projects/acme');
        CommandRequest::query()->findOrFail($first)->propose();

        $again = CommandRequest::query()->findOrFail($first);
        $this->assertSame(RequestStatus::AwaitingSampleApproval, $again->status);
        $this->assertSame(sprintf(self::APPROVE_STEP, $first), $again->nextStep->command);
    }

    private function open(string $agentId, string $folder): string
    {
        return $this->runAsAgentId(
            $agentId,
            new OpenCommandRequestCommand(
                'acme verify',
                str_repeat('a', 64),
                'acme verify --all',
                $folder,
                RequestHoldReason::UnknownCommand,
            ),
        );
    }
}
