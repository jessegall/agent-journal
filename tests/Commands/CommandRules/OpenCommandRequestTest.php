<?php

declare(strict_types=1);

namespace Tests\Commands\CommandRules;

use App\Commands\CommandRules\OpenCommandRequest\OpenCommandRequestCommand;
use App\Enums\CommandRules\RequestHoldReason;
use App\Enums\CommandRules\RequestStatus;
use App\Models\CommandRules\CommandRequest;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * An agent opens a request for an unknown command: opening twice gives the same request with its propose step, another
 * agent gets its own, in its own project, and a fresh read gives the same state and next step.
 */
#[TestsCommand(OpenCommandRequestCommand::class)]
final class OpenCommandRequestTest extends TestCase
{
    use RefreshHookDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner()->project('Shop')
            ->idleAgent('Ada')
            ->idleAgent('Bo')
            ->idleAgent('Cy', 'main-agent', 'Shop');
    }

    private const string PROPOSE_STEP = 'the command_types_propose tool with request %s';

    private const string APPROVE_STEP = "waiting for the owner to approve request %s's sample";

    public function test_opening_twice_returns_the_same_request_with_its_propose_step(): void
    {
        $first = $this->open('Ada', '/projects/acme');
        $second = $this->open('Ada', '/projects/acme');

        $request = CommandRequest::query()->findOrFail($first);
        $this->assertSame($first, $second);
        $this->assertSame(RequestStatus::CollectingDeclaration, $request->status);
        $this->assertStringStartsWith(sprintf(self::PROPOSE_STEP, $first), $request->nextStep->command);
    }

    public function test_another_agent_gets_its_own_request_in_its_own_project(): void
    {
        $first = $this->open('Ada', '/projects/acme');
        $local = CommandRequest::query()->findOrFail($first)->project_id;
        $this->assertNotSame($first, $this->open('Bo', '/projects/acme'));

        $other = CommandRequest::query()->findOrFail($this->open('Cy', '/projects/acme'));

        $this->assertSame($this->journal->agentCalled('Ada')->project_id, $local);
        $this->assertSame($this->journal->projectCalled('Shop')->id, $other->project_id);
    }

    public function test_a_fresh_read_gives_the_same_state_and_next_step(): void
    {
        $first = $this->open('Ada', '/projects/acme');
        CommandRequest::query()->findOrFail($first)->propose();

        $again = CommandRequest::query()->findOrFail($first);
        $this->assertSame(RequestStatus::AwaitingSampleApproval, $again->status);
        $this->assertSame(sprintf(self::APPROVE_STEP, $first), $again->nextStep->command);
    }

    private function open(string $agent, string $folder): string
    {
        return $this->journal->runAsAgentId(
            $this->journal->agentCalled($agent)->id,
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
