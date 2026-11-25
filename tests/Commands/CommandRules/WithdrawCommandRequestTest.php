<?php

declare(strict_types=1);

namespace Tests\Commands\CommandRules;

use App\Commands\CommandRules\OpenCommandRequest\OpenCommandRequestCommand;
use App\Commands\CommandRules\WithdrawCommandRequest\WithdrawCommandRequestCommand;
use App\Enums\CommandRules\RequestHoldReason;
use App\Enums\CommandRules\RequestStatus;
use App\Exceptions\RequestTransitionRefused;
use App\Models\CommandRules\CommandRequest;
use Tests\Support\ActsAsActors;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * An agent withdraws its request, which stays readable while a new attempt opens a new one; another agent cannot
 * withdraw it, and no state is skipped.
 */
final class WithdrawCommandRequestTest extends TestCase
{
    use ActsAsActors;
    use RefreshHookDatabase;

    public function test_a_withdrawn_request_stays_readable_and_a_new_attempt_opens_a_new_one(): void
    {
        $first = $this->open('agent-1', '/projects/acme');
        $this->runAsAgentId('agent-1', new WithdrawCommandRequestCommand($first));

        $request = CommandRequest::query()->findOrFail($first);
        $this->assertSame(RequestStatus::Withdrawn, $request->status);
        $this->assertSame([], $request->nextStep->steps);
        $this->assertNotSame($first, $this->open('agent-1', '/projects/acme'));
    }

    public function test_another_agent_cannot_withdraw_it_and_no_state_is_skipped(): void
    {
        $first = $this->open('agent-1', '/projects/acme');

        $this->assertThrows(
            fn () => $this->runAsAgentId('agent-2', new WithdrawCommandRequestCommand($first)),
            RequestTransitionRefused::class,
        );
        $this->assertThrows(
            fn () => CommandRequest::query()->findOrFail($first)->approve(),
            RequestTransitionRefused::class,
        );
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
