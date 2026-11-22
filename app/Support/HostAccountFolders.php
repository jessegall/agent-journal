<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\AccountFolders;
use App\Data\AccountFolderReplyData;
use App\Exceptions\AccountFolderRefused;
use Illuminate\Support\Str;

/**
 * Where agents run in containers, the accounts root is root's, so the agent host makes and removes each account
 * folder as root, named by its plain id, and the sign-in service only writes inside the folder it was given. A make
 * names its operation, so a make sent again after a lost reply finds its own folder; a remove of a gone folder is done.
 */
final readonly class HostAccountFolders implements AccountFolders
{
    public function __construct(private HostStartSocket $socket) {}

    public function make(string $directory): void
    {
        $this->ask('makeFolder', ['folder' => basename($directory), 'operation' => (string) Str::uuid()]);
    }

    public function remove(string $directory): void
    {
        $this->ask('removeFolder', ['folder' => basename($directory)]);
    }

    /**
     * Sends the request, and once more as it was when its reply is lost: the host answers the same request the same
     * way, so the second answer says what became of the first.
     *
     * @param  array<string, string>  $request
     */
    private function ask(string $operation, array $request): void
    {
        $reply = $this->socket->ask([$operation => $request], AccountFolderReplyData::class);

        if ($reply === null) {
            $reply = $this->socket->ask([$operation => $request], AccountFolderReplyData::class);
        }

        if (! $reply instanceof AccountFolderReplyData) {
            throw AccountFolderRefused::hostUnreachable();
        }

        if (! $reply->isDone) {
            throw AccountFolderRefused::byHost($reply->reason);
        }
    }
}
