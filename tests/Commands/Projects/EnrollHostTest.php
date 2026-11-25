<?php

declare(strict_types=1);

namespace Tests\Commands\Projects;

use App\Commands\Projects\EnrollHost\EnrollHostCommand;
use App\Enums\Projects\ArrangementType;
use App\Models\Projects\Host;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\RunsTrustedCommands;
use Tests\TestCase;

/**
 * A host enrolls with its installation name, start roots and arrangement, and gets its id and a secret that the
 * journal keeps only as a digest.
 */
final class EnrollHostTest extends TestCase
{
    use RefreshHookDatabase;
    use RunsTrustedCommands;

    public function test_a_host_enrolls_with_its_roots_and_arrangement_and_its_secret_is_not_kept(): void
    {
        $enrolled = $this->asSystem(new EnrollHostCommand('laptop', [base_path()], ArrangementType::Contained));

        $host = Host::query()->findOrFail($enrolled->hostId);
        $this->assertSame(['laptop', [base_path()], ArrangementType::Contained], [$host->installation_name, $host->start_roots, $host->arrangement]);
        $this->assertSame(64, strlen($enrolled->secret));
        $this->assertSame(0, Host::query()->where('credential_hash', $enrolled->secret)->count());
    }
}
