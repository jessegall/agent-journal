<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Accounts\AccountFolderUses as AccountFolderUsesContract;
use App\Contracts\Accounts\SignInHost;
use App\Enums\Projects\ArrangementType;
use App\Exceptions\AccountFolderRefused;
use Illuminate\Support\Str;

/**
 * Asks the contained host, through a folder_use order the journal places, whether a container still binds an
 * account's displaced folder; a host that cannot answer counts as binding it. The journal itself stops every process
 * of an account before it hands out its sign-in, so nothing else is asked of the host.
 */
final readonly class AccountFolderUses implements AccountFolderUsesContract
{
    public function __construct(
        private SignInHost $host,
        private FolderOrderWait $wait,
        private ArrangementType $arrangement,
    ) {}

    /**
     * A displaced folder is free once no container binds it; on a contained host that cannot say so, it counts as
     * bound.
     */
    public function isDisplacedFolderFree(string $directory, string $accountId): bool
    {
        if (! $this->arrangement->isContained()) {
            return true;
        }

        try {
            $answer = $this->wait->answerOf($this->host->orderFolderUse(basename($directory), (string) Str::uuid()));
        } catch (AccountFolderRefused) {
            return false;
        }

        return $answer->isDone() && ! $answer->isBound;
    }
}
