<?php

declare(strict_types=1);

namespace Domain\Helpers\Tests\Feature;

use App\Commands\Agents\RetireAgent\RetireAgentCommand;
use App\Contracts\Bus\CommandBus;
use App\Exceptions\ProfileProposalRefused;
use App\Support\ProfileProposal;
use Domain\Helpers\Commands\CancelHelperJob\CancelHelperJobCommand;
use Domain\Helpers\Commands\StartHelper\StartHelperCommand;
use Domain\Helpers\Exceptions\HelperBusy;
use Domain\Helpers\Exceptions\HelperRetired;
use Domain\Helpers\Exceptions\HelperUnavailable;
use Domain\Helpers\Models\HelperIdentity;
use Domain\Helpers\Tests\Support\DispatchesHelpers;
use Domain\Helpers\Tests\TestCase;
use Domain\Helpers\Values\HelperReceipt;
use Domain\Helpers\Values\HelperWork;
use Illuminate\Support\Str;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * A profile says how many helpers it may have: a single profile binds every job to its one designated
 * helper and never makes a second, a per-job profile makes a fresh helper for each new job while a replayed start keeps
 * it, and an unknown instances value refuses the proposal.
 */
#[TimeLimit(seconds: 10, reason: 'It activates profiles and starts several helper sessions.')]
final class HelperInstancesTest extends TestCase
{
    use DispatchesHelpers;
    use RefreshHookDatabase;

    public function test_a_single_profile_binds_its_one_helper_and_never_makes_a_second(): void
    {
        $first = $this->start((string) Str::ulid(), 'Review plan 7', profileKey: 'lone-reviewer');
        $this->finish($first);
        $second = $this->start((string) Str::ulid(), 'Review plan 8', profileKey: 'lone-reviewer');

        $this->assertSame($first->identityId, $second->identityId);
        $this->expectException(HelperBusy::class);

        $this->start((string) Str::ulid(), 'Review plan 9', profileKey: 'lone-reviewer');
    }

    public function test_a_per_job_profile_makes_a_fresh_helper_per_job_and_a_replay_keeps_it(): void
    {
        $requestId = (string) Str::ulid();
        $first = $this->start($requestId, 'Review plan 7', profileKey: 'job-reviewer');
        $again = $this->start($requestId, 'Review plan 7', profileKey: 'job-reviewer');
        $other = $this->start((string) Str::ulid(), 'Review plan 8', profileKey: 'job-reviewer');

        $this->assertSame($first->identityId, $again->identityId);
        $this->assertNotSame($first->identityId, $other->identityId);
    }

    public function test_a_retired_single_helper_is_replaced_once_its_process_ended(): void
    {
        $first = $this->start((string) Str::ulid(), 'Review plan 7', profileKey: 'lone-reviewer');
        $this->finish($first);
        $this->retireHelperOf($first);

        $second = $this->start((string) Str::ulid(), 'Review plan 8', profileKey: 'lone-reviewer');

        $this->assertNotSame($first->identityId, $second->identityId);
        $this->assertSame($second->identityId, HelperIdentity::findDesignatedFor('lone-reviewer')->get()->id);
    }

    public function test_the_single_helper_cannot_review_a_purpose_it_worked_on_independently(): void
    {
        $first = $this->start((string) Str::ulid(), 'Review plan 7', profileKey: 'lone-reviewer');
        $this->finish($first);
        $this->expectException(HelperUnavailable::class);

        $this->app->make(CommandBus::class)->run(new StartHelperCommand(
            (string) Str::ulid(),
            'lone-reviewer',
            'default',
            null,
            new HelperWork(null, null, 'Review plan 7', 'Review it again.', [], true),
        ));
    }

    public function test_a_replay_after_the_reused_helper_retired_mid_job_is_refused(): void
    {
        $requestId = (string) Str::ulid();
        $first = $this->start($requestId, 'Review plan 7');
        $this->endSessionOf($first);
        $this->retireHelperOf($first);
        $this->expectException(HelperRetired::class);

        $this->start($requestId, 'Review plan 7');
    }

    private function finish(HelperReceipt $receipt): void
    {
        $this->app->make(CommandBus::class)->run(
            new CancelHelperJobCommand($receipt->jobId, 'cancel-'.$receipt->jobId),
        );

        $this->endSessionOf($receipt);
    }

    private function retireHelperOf(HelperReceipt $receipt): void
    {
        $agentId = HelperIdentity::query()->acrossActors()->findOrFail($receipt->identityId)->helper_actor_id;
        $this->app->make(CommandBus::class)->run(new RetireAgentCommand($agentId));
    }

    public function test_an_unknown_instances_value_refuses_the_proposal(): void
    {
        $this->expectException(ProfileProposalRefused::class);

        ProfileProposal::fromConfiguration(['profiles' => [
            'odd-reviewer' => [
                'base' => 'read-only-helper',
                'tier' => 2,
                'instances' => 'many',
            ],
        ]]);
    }
}
