<?php

declare(strict_types=1);

namespace Tests\Unit\Profiles;

use App\Accounts\AccountFolderUses;
use App\Accounts\FolderInstructionWait;
use App\Accounts\SignInProtocols;
use App\Files\Contracts\Files;
use App\Jobs\SignInDeadline;
use App\Projects\Enums\ArrangementType;
use App\Support\LocalAccountFolders;
use App\Support\PrivateSignInProcesses;
use Illuminate\Support\Facades\Bus;
use Tests\Fixtures\Profiles\RecordingSignInHost;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * After a restart the host's runner reports at its start that it runs no sign-in.
 */
#[TimeLimit(seconds: 3, reason: 'It commits attempts through the bus and empties four tables per test.')]
final class SignInRestartTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        Bus::fake([SignInDeadline::class]);
    }

    public function test_the_runner_reports_at_start_that_it_runs_nothing(): void
    {
        $host = new RecordingSignInHost(null);

        new PrivateSignInProcesses(
            $host,
            $this->app->make(SignInProtocols::class),
            static fn () => null,
            $this->app->make(Files::class),
            new LocalAccountFolders($this->app->make(Files::class)),
            new AccountFolderUses($host, new FolderInstructionWait($host, static fn () => null), ArrangementType::Local),
        )->reconcileAtStart();

        $this->assertSame([[]], $host->reconciled);
    }
}
