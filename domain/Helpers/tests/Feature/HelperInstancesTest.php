<?php

declare(strict_types=1);

namespace Domain\Helpers\Tests\Feature;

use App\Bus\Contracts\CommandBus;
use App\Profiles\Exceptions\ProfileProposalRefused;
use App\Profiles\Support\ProfileProposal;
use Domain\Helpers\Commands\CancelHelperJob;
use Domain\Helpers\Exceptions\HelperBusy;
use Domain\Helpers\Tests\Support\DispatchesHelpers;
use Domain\Helpers\Tests\TestCase;
use Illuminate\Support\Str;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * A profile says how many helpers it may have (task 956): a single profile binds every job to its one designated
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
        $this->app->make(CommandBus::class)->run(new CancelHelperJob($first->jobId, 'cancel-first'));
        $this->endSessionOf($first);
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

    public function test_an_unknown_instances_value_refuses_the_proposal(): void
    {
        $this->expectException(ProfileProposalRefused::class);

        ProfileProposal::fromConfiguration(['profiles' => [
            'odd-reviewer' => ['base' => 'read-only-helper', 'model' => 'sonnet', 'instances' => 'many'],
        ]]);
    }
}
