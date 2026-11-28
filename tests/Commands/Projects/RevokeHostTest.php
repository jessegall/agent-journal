<?php

declare(strict_types=1);

namespace Tests\Commands\Projects;

use App\Models\Projects\Host;
use App\Projects\Commands\EnrollHost\EnrollHostCommand;
use App\Projects\Commands\RevokeHost\RevokeHostCommand;
use App\Projects\Enums\ArrangementType;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * Revoking an installation name revokes every host still enrolled under it and leaves the other names alone.
 */
#[TestsCommand(RevokeHostCommand::class)]
final class RevokeHostTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_every_host_of_the_name_is_revoked_and_another_name_stays(): void
    {
        $gone = $this->journal->asSystem(new EnrollHostCommand('test-machine', [base_path()], ArrangementType::Local));
        $kept = $this->journal->asSystem(new EnrollHostCommand('laptop', [base_path()], ArrangementType::Local));

        $revoked = $this->journal->asSystem(new RevokeHostCommand('test-machine'));

        $this->assertSame(
            [1, true, false, 0],
            [
                $revoked,
                Host::query()->findOrFail($gone->hostId)->isRevoked(),
                Host::query()->findOrFail($kept->hostId)->isRevoked(),
                $this->journal->asSystem(new RevokeHostCommand('test-machine')),
            ],
        );
    }
}
