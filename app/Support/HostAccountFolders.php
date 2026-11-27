<?php

declare(strict_types=1);

namespace App\Support;

use App\Accounts\Contracts\AccountFolders;
use App\Accounts\Contracts\SignInHost;
use App\Accounts\Exceptions\AccountFolderRefused;
use App\Accounts\FolderInstructionWait;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Str;

/**
 * A contained host's account folders: made and removed by the host's agent daemon as root, through an instruction the
 * journal places for this host, as the sign-in runner owns no daemon itself.
 */
final readonly class HostAccountFolders implements AccountFolders
{
    public function __construct(private SignInHost $host, private FolderInstructionWait $wait) {}

    public function make(string $directory): void
    {
        $operation = (string) Str::uuid();
        $this->settle($this->ask(fn () => $this->host->instructionFolderMake(basename($directory), $operation)));
    }

    public function remove(string $directory): void
    {
        $operation = (string) Str::uuid();
        $this->settle($this->ask(fn () => $this->host->instructionFolderRemove(basename($directory), $operation)));
    }

    /**
     * Places the instruction, and once more when its reply was lost: the same operation finds the instruction already made.
     *
     * @param  callable(): string  $instruction
     */
    private function ask(callable $instruction): string
    {
        try {
            return $instruction();
        } catch (ConnectionException) {
            return $instruction();
        }
    }

    /**
     * @throws AccountFolderRefused
     */
    private function settle(string $instructionId): void
    {
        $answer = $this->wait->answerOf($instructionId);

        if ($answer->isRefused()) {
            throw AccountFolderRefused::byHost($answer->reason);
        }
    }
}
