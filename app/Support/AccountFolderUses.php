<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Accounts\AccountFolderUses as AccountFolderUsesContract;
use App\Data\Hosts\FolderUseReplyData;
use App\Enums\Projects\ArrangementType;

/**
 * Asks the contained host, over its start socket, whether a container still binds an account's displaced folder; a
 * host that cannot be reached counts as binding it. The journal itself stops every process of an account before it
 * hands out its sign-in, so nothing else is asked of the host.
 */
final readonly class AccountFolderUses implements AccountFolderUsesContract
{
    private HostStartSocket $socket;

    public function __construct(string $socket, private ArrangementType $arrangement)
    {
        $this->socket = new HostStartSocket($socket);
    }

    public function isDisplacedFolderFree(string $directory, string $accountId): bool
    {
        if (! $this->arrangement->isContained()) {
            return true;
        }

        if (! $this->socket->isConfigured()) {
            return false;
        }

        $reply = $this->socket->ask(['folderUse' => ['folder' => basename($directory)]], FolderUseReplyData::class);

        return $reply instanceof FolderUseReplyData && ! $reply->isBound;
    }
}
