<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Bus\Contracts\CommandBus;
use App\Processes\Commands\OpenCommandRequest;
use App\Processes\Commands\WithdrawCommandRequest;
use App\Processes\Enums\RequestHoldReason;
use App\Processes\Enums\RequestState;
use App\Processes\Exceptions\RequestTransitionRefused;
use App\Processes\Models\CommandRequest;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * One persistent request holds a command the journal will not run yet and names its next step (doc 21 revision 6,
 * section 71; stories 149, 179, 183 and 191-194).
 */
final class CommandRequestTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_opening_twice_returns_the_same_request_with_its_propose_step(): void
    {
        $first = $this->open('agent-1', '/projects/acme');
        $second = $this->open('agent-1', '/projects/acme');

        $request = CommandRequest::query()->findOrFail($first);
        $this->assertSame($first, $second);
        $this->assertSame(RequestState::CollectingDeclaration, $request->state);
        $this->assertStringStartsWith("journal command-type propose --request {$first}", $request->nextStep()->command);
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

    public function test_a_withdrawn_request_stays_readable_and_a_new_attempt_opens_a_new_one(): void
    {
        $first = $this->open('agent-1', '/projects/acme');
        $this->runAs('agent-1', new WithdrawCommandRequest($first));

        $request = CommandRequest::query()->findOrFail($first);
        $this->assertSame(RequestState::Withdrawn, $request->state);
        $this->assertSame([], $request->nextStep()->steps);
        $this->assertNotSame($first, $this->open('agent-1', '/projects/acme'));
    }

    public function test_another_agent_cannot_withdraw_it_and_no_state_is_skipped(): void
    {
        $first = $this->open('agent-1', '/projects/acme');

        $this->assertThrows(fn () => $this->runAs('agent-2', new WithdrawCommandRequest($first)), RequestTransitionRefused::class);
        $this->assertThrows(fn () => CommandRequest::query()->findOrFail($first)->approve(), RequestTransitionRefused::class);
    }

    public function test_a_fresh_read_gives_the_same_state_and_next_step(): void
    {
        $first = $this->open('agent-1', '/projects/acme');
        CommandRequest::query()->findOrFail($first)->propose();

        $again = CommandRequest::query()->findOrFail($first);
        $this->assertSame(RequestState::AwaitingSampleApproval, $again->state);
        $this->assertSame("waiting for the owner: journal reader sample-approve {$first}", $again->nextStep()->command);
    }

    private function open(string $agentId, string $folder): string
    {
        return $this->runAs($agentId, new OpenCommandRequest('acme verify', str_repeat('a', 64), 'acme verify --all', $folder, RequestHoldReason::UnknownCommand));
    }

    private function runAs(string $agentId, object $command): string
    {
        $this->app->forgetScopedInstances();
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forAgent($agentId));

        return $this->app->make(CommandBus::class)->run($command);
    }
}
