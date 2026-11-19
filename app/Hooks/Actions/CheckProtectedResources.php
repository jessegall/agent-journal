<?php

declare(strict_types=1);

namespace App\Hooks\Actions;

use App\Agents\Contracts\SessionOutputAccess;
use App\Hooks\Contracts\ProtectedResources;
use App\Hooks\Inputs\ProtectedFileRead;
use App\Hooks\Support\ProtectedAccounts;

/**
 * Checks a session's native file and shell tools against the saved accounts' folders: a read inside them passes only
 * for the session's own saved outputs, as its current process start granted them; a session with no start or no
 * mapping reads nothing there.
 */
final readonly class CheckProtectedResources implements ProtectedResources
{
    public function __construct(
        private ProtectedAccounts $accounts,
        private SessionOutputAccess $outputs,
    ) {}

    public function refusesRead(string $sessionId, ProtectedFileRead $read): bool
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
        if ($this->accounts->readsSignInIn($command)) {
            return true;
        }

        $named = ProtectedFileRead::inFolder($workFolder, $this->accounts->pathsNamedIn($command));

        return $this->refusesRead($sessionId, $named);
    }
}
