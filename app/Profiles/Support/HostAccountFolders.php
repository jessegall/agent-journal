<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\Profiles\Contracts\AccountFolders;
use App\Profiles\Data\AccountFolderReplyData;
use App\Profiles\Exceptions\AccountFolderRefused;

/**
 * Where agents run in containers, the accounts root is root's, so the agent host makes and removes each account
 * folder as root, named by its plain id, and the sign-in service only writes inside the folder it was given.
 */
final readonly class HostAccountFolders implements AccountFolders
{
    public function __construct(private HostStartSocket $socket) {}

    public function make(string $directory): void
    {
        $this->ask('makeFolder', $directory);
    }

    public function remove(string $directory): void
    {
        $this->ask('removeFolder', $directory);
    }

    private function ask(string $operation, string $directory): void
    {
        $reply = $this->socket->ask([$operation => ['folder' => basename($directory)]], AccountFolderReplyData::class);

        if (! $reply instanceof AccountFolderReplyData) {
            throw AccountFolderRefused::hostUnreachable();
        }

        if (! $reply->done) {
            throw AccountFolderRefused::byHost($reply->reason);
        }
    }
}
