<?php

declare(strict_types=1);

namespace App\Accounts;

use App\Accounts\Contracts\SignInHost;
use App\Accounts\Exceptions\AccountFolderRefused;
use App\Hosts\HostOrderPlacement;
use App\Values\HostFolderAnswer;
use Carbon\CarbonImmutable;
use Closure;

/**
 * Waits, as the sign-in runner, for this host's answer to one of its folder orders: placing the order woke the host,
 * so the answer is back within a poll or two; past the order's own lifetime the host counts as unreachable.
 */
final readonly class FolderOrderWait
{
    /**
     * How long past the order's lifetime the runner still waits for its answer.
     */
    private const int SPARE_SECONDS = 10;

    /**
     * @param  Closure(): void  $pause
     */
    public function __construct(private SignInHost $host, private Closure $pause) {}

    /**
     * @throws AccountFolderRefused
     */
    public function answerOf(string $orderId): HostFolderAnswer
    {
        $deadline = CarbonImmutable::now()->addSeconds(HostOrderPlacement::ORDER_SECONDS + self::SPARE_SECONDS);

        while (CarbonImmutable::now()->lessThan($deadline)) {
            $answer = $this->host->folderAnswer($orderId);

            if (! $answer->isPending()) {
                return $answer;
            }

            ($this->pause)();
        }

        throw AccountFolderRefused::hostUnreachable();
    }
}
