<?php

declare(strict_types=1);

namespace App\Profiles\Console;

use App\Profiles\Support\HostAccountDrain;
use App\Profiles\Support\HostSecret;
use App\Profiles\Support\PrivateSignInProcesses;
use App\Profiles\Support\SignedSignInHost;
use App\Profiles\Support\SignInProtocols;
use Illuminate\Console\Command;
use Illuminate\Http\Client\Factory;

/**
 * The host's sign-in runner, started by bin/journal-account on the host, never inside the app's containers: it runs
 * sign-ins one after another until stopped, or one with --once.
 */
final class RunSignInsCommand extends Command
{
    protected $signature = 'accounts:run-sign-ins {--once : run at most one sign-in}';

    protected $description = 'Run the journal sign-ins on this host';

    public function handle(Factory $http, SignInProtocols $protocols): int
    {
        $runner = new PrivateSignInProcesses(
            new SignedSignInHost($http, (string) getenv('JOURNAL_URL'), HostSecret::fromEnvironment(
                (string) getenv('JOURNAL_HOST_SECRET_FILE'),
                (string) getenv('JOURNAL_HOST_SECRET'),
            )),
            $protocols,
            static fn () => usleep(500_000),
            new HostAccountDrain((string) getenv('AGENTS_HOST_START_SOCKET')),
        );

        $runner->reconcileAtStart();

        do {
            $ran = $runner->runNext() || $runner->checkNext() || $runner->cleanNext();

            if (! $ran && ! $this->option('once')) {
                sleep(2);
            }
        } while (! $this->option('once'));

        return self::SUCCESS;
    }
}
