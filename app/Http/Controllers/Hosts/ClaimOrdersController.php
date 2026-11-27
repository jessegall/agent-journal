<?php

declare(strict_types=1);

namespace App\Http\Controllers\Hosts;

use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Hosts\Commands\ClaimHostOrders\ClaimHostOrdersCommand;
use App\Hosts\HostClaimSlots;
use App\Hosts\HostWake;
use App\Hosts\Values\HostContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * The host's long poll: it takes the orders waiting for it, or when none waits it waits until one is made, at most
 * the seconds it asked. One claim per host waits at a time.
 */
final readonly class ClaimOrdersController
{
    /**
     * The longest a host's claim waits for an order.
     */
    public const int WAIT_SECONDS_LIMIT = 25;

    /**
     * The most orders one claim takes.
     */
    public const int CLAIM_LIMIT = 50;

    #[Dispatches(ClaimHostOrdersCommand::class)]
    public function __invoke(
        Request $request,
        HostContext $host,
        CommandBus $commands,
        HostWake $wake,
        HostClaimSlots $slots,
    ): JsonResponse {
        $request->validate([
            'limit' => ['sometimes', 'integer', 'min:1', 'max:'.self::CLAIM_LIMIT],
            'wait' => ['sometimes', 'integer', 'min:0', 'max:'.self::WAIT_SECONDS_LIMIT],
        ]);

        $deposesAnother = $slots->isTaken($host->hostId);
        $slot = $slots->take($host->hostId);

        if ($deposesAnother) {
            $wake->wakeHost($host->hostId);
        }

        try {
            $claim = new ClaimHostOrdersCommand($host->hostId, $request->integer('limit', self::CLAIM_LIMIT));
            $claimed = $commands->run($claim);
            $wait = $claimed->waitSeconds($request->integer('wait'));

            $isWoken = $claimed->isEmpty() && $wait > 0 && $wake->waitForHost($host->hostId, $wait);

            // A claim the host's newer one took the slot from answers what it had and passes the wake on to it.
            if ($isWoken && ! $slots->isHeldBy($host->hostId, $slot)) {
                $wake->wakeHost($host->hostId);
            } elseif ($isWoken) {
                $claimed = $commands->run($claim);
            }

            return new JsonResponse($claimed);
        } finally {
            $slots->release($host->hostId, $slot);
        }
    }
}
