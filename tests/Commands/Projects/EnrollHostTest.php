<?php

declare(strict_types=1);

namespace Tests\Commands\Projects;

use App\Models\Projects\Host;
use App\Projects\Commands\EnrollHost\EnrollHostCommand;
use App\Projects\Commands\RecordHostCallFailure\RecordHostCallFailureCommand;
use App\Projects\Enums\ArrangementType;
use App\Projects\Exceptions\HostArrangementRefused;
use App\Projects\Exceptions\HostCredentialRejected;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A host enrolls with its installation name, start roots and arrangement, and gets its id and a secret that the
 * journal keeps only as a digest.
 */
#[TestsCommand(EnrollHostCommand::class)]
final class EnrollHostTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_host_enrolls_with_its_roots_and_arrangement_and_its_secret_is_not_kept(): void
    {
        $enrolled = $this->journal->asSystem(
            new EnrollHostCommand('laptop', [base_path()], ArrangementType::Contained),
        );

        $host = Host::query()->findOrFail($enrolled->hostId);
        $this->assertSame(
            ['laptop', [base_path()], ArrangementType::Contained],
            [$host->installation_name, $host->start_roots, $host->arrangement],
        );
        $this->assertSame(64, strlen($enrolled->secret));
        $this->assertSame(0, Host::query()->where('credential_hash', $enrolled->secret)->count());
    }

    public function test_a_name_enrolled_again_keeps_its_one_host_with_the_new_secret_and_no_old_alarm(): void
    {
        $enroll = new EnrollHostCommand('local', [base_path()], ArrangementType::Contained);
        $first = $this->journal->asSystem($enroll);
        $failed = new RecordHostCallFailureCommand($first->hostId, '/host/heartbeat', 500, 'the journal was down');
        $this->journal->asSystem($failed);

        $second = $this->journal->asSystem($enroll);

        $this->assertSame(
            [$first->hostId, 1, $first->hostId, null],
            [
                $second->hostId,
                Host::query()->where('installation_name', 'local')->count(),
                Host::findForSecret($second->secret)->id,
                Host::query()->findOrFail($second->hostId)->failing_since,
            ],
        );
        $this->journal->assertRefused(HostCredentialRejected::class, fn () => Host::findForSecret($first->secret));
    }

    public function test_a_name_enrolled_again_under_another_arrangement_is_refused(): void
    {
        $this->journal->asSystem(new EnrollHostCommand('local', [base_path()], ArrangementType::Contained));

        $this->journal->assertRefused(
            HostArrangementRefused::class,
            fn () => $this->journal->asSystem(new EnrollHostCommand('local', [base_path()], ArrangementType::Local)),
        );
    }
}
