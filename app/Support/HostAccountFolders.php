<?php

declare(strict_types=1);

namespace App\Support;

use App\Accounts\Contracts\AccountFolders;
use App\Accounts\Contracts\SignInHost;
use App\Accounts\Exceptions\AccountFolderRefused;
use App\Accounts\FolderOrderWait;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Str;

/**
 * A contained host's account folders: made and removed by the host's agent daemon as root, through an order the
 * journal places for this host, as the sign-in runner owns no daemon itself.
 */
final readonly class HostAccountFolders implements AccountFolders
{
    public function __construct(private SignInHost $host, private FolderOrderWait $wait) {}

    public function make(string $directory): void
    {
        $operation = (string) Str::uuid();
        $this->settle($this->ask(fn () => $this->host->orderFolderMake(basename($directory), $operation)));
    }

    public function remove(string $directory): void
    {
        $operation = (string) Str::uuid();
        $this->settle($this->ask(fn () => $this->host->orderFolderRemove(basename($directory), $operation)));
    }

    /**
     * Places the order, and once more when its reply was lost: the same operation finds the order already made.
     *
     * @param  callable(): string  $order
     */
    private function ask(callable $order): string
    {
        try {
            return $order();
        } catch (ConnectionException) {
            return $order();
        }
    }

    /**
     * @throws AccountFolderRefused
     */
    private function settle(string $orderId): void
    {
        $answer = $this->wait->answerOf($orderId);

        if ($answer->isRefused()) {
            throw AccountFolderRefused::byHost($answer->reason);
        }
    }
}
