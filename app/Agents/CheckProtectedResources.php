<?php

declare(strict_types=1);

namespace App\Agents;

use App\Accounts\ProtectedAccounts;
use App\Reads\Contracts\SessionOutputAccess;
use App\Support\Inputs\NamedReadPaths;

/**
 * Checks a session's native file and shell tools against the saved accounts' folders: a read inside them passes only
 * for the session's own saved outputs, as its current process start granted them; a session with no start or no
 * mapping reads nothing there.
 */
final readonly class CheckProtectedResources
{
    public function __construct(
        private ProtectedAccounts $accounts,
        private SessionOutputAccess $outputs,
    ) {}

    public function refusesRead(string $sessionId, NamedReadPaths $read): bool
    {
        foreach ($read->paths as $path) {
            if ($this->accounts->covers($path) && ! $this->outputs->mayRead($sessionId, $path)) {
                return true;
            }
        }

        return false;
    }

    public function refusesChange(string $path): bool
    {
        return $this->accounts->covers($path);
    }

    public function refusesCommand(string $sessionId, string $command, string $workFolder): bool
    {
        if ($this->accounts->readsSignIn($command)) {
            return true;
        }

        $named = NamedReadPaths::inFolder($workFolder, $this->accounts->pathsNamedIn($command));

        return $this->refusesRead($sessionId, $named);
    }
}
