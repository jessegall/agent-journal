<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Accounts\AccountOwnerDrain;
use App\Data\Hosts\DrainReplyData;
use App\Data\Hosts\FolderUseReplyData;
use App\Enums\ArrangementType;

/**
 * Asks the protected host, over its start socket, to end the account's shared owner and every execution on it, naming
 * the account by its folder (the local host's way) and its id (the contained host's). Locally, no protected host
 * means nothing of the account can run; a contained journal always has one, so an unset socket refuses there. A host
 * that cannot be reached, or cannot prove the end, keeps the account unchanged. It also asks whether a container still
 * binds a displaced folder.
 */
final readonly class HostAccountDrain implements AccountOwnerDrain
{
    private HostStartSocket $socket;

    public function __construct(string $socket, private ArrangementType $arrangement)
    {
        $this->socket = new HostStartSocket($socket);
    }

    public function drain(string $directory, string|null $accountId): bool
    {
        if ($accountId === null) {
            return true;
        }

        if (! $this->socket->isConfigured()) {
            return ! $this->arrangement->isContained();
        }

        $reply = $this->socket->ask(
            ['drain' => [
                'account' => $directory,
                'accountId' => $accountId,
            ]],
            DrainReplyData::class,
        );

        return $reply instanceof DrainReplyData && $reply->isDrained;
    }

    public function isDisplacedFolderFree(string $directory, string $accountId): bool
    {
        if (! $this->arrangement->isContained()) {
            return $this->drain($directory, $accountId);
        }

        if (! $this->socket->isConfigured()) {
            return false;
        }

        $reply = $this->socket->ask(['folderUse' => ['folder' => basename($directory)]], FolderUseReplyData::class);

        return $reply instanceof FolderUseReplyData && ! $reply->isBound;
    }
}
