<?php

declare(strict_types=1);

namespace App\Profiles\Console;

use App\Agents\Support\ArrangementSetting;
use App\Files\Contracts\Files;
use App\Profiles\Exceptions\SignInRunnerRefused;
use App\Profiles\Support\HostAccountDrain;
use App\Profiles\Support\HostAccountFolders;
use App\Profiles\Support\HostSecret;
use App\Profiles\Support\HostStartSocket;
use App\Profiles\Support\LocalAccountFolders;
use App\Profiles\Support\PrivateSignInProcesses;
use App\Profiles\Support\SignedSignInHost;
use App\Profiles\Support\SignInProtocols;
use Illuminate\Console\Command;
use Illuminate\Http\Client\Factory;

/**
 * The sign-in runner, never inside the app's own containers: bin/journal-account starts it on the Mac, and the
 * accounts service runs it on a server. It runs sign-ins, checks and cleanups one after another until stopped, or one
 * with --once.
 */
final class RunSignInsCommand extends Command
{
    protected $signature = 'accounts:run-sign-ins {--once : run at most one sign-in}';

    protected $description = 'Run the journal sign-ins on this host';

    public function handle(Factory $http, SignInProtocols $protocols, ArrangementSetting $arrangement, Files $files): int
    {
        $runner = new PrivateSignInProcesses(
            new SignedSignInHost($http, (string) getenv('JOURNAL_URL'), HostSecret::fromEnvironment(
                (string) getenv('JOURNAL_HOST_SECRET_FILE'),
                (string) getenv('JOURNAL_HOST_SECRET'),
            ), $arrangement->arrangement),
            $protocols,
            static fn () => usleep(500_000),
            $files,
            $arrangement->arrangement->isContained()
                ? new HostAccountFolders(new HostStartSocket((string) getenv('AGENTS_HOST_START_SOCKET')))
                : new LocalAccountFolders($files),
            new HostAccountDrain((string) getenv('AGENTS_HOST_START_SOCKET'), $arrangement->arrangement),
        );

        $runner->reconcileAtStart();
        $refusal = null;

        do {
            $ran = false;

            try {
                $ran = $runner->runNext() || $runner->checkNext() || $runner->cleanNext();
            } catch (SignInRunnerRefused $refused) {
                $refusal = $this->reportOnce($refused, $refusal);
            }

            if (! $ran && ! $this->option('once')) {
                sleep(2);
            }
        } while (! $this->option('once'));

        return self::SUCCESS;
    }

    /**
     * Prints a refusal the first time the journal gives it, so a runner it refuses waits quietly instead of repeating
     * the same line every poll.
     */
    private function reportOnce(SignInRunnerRefused $refused, string|null $printed): string
    {
        if ($refused->getMessage() !== $printed) {
            $this->error($refused->getMessage());
        }

        return $refused->getMessage();
    }
}
