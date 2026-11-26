<?php

declare(strict_types=1);

namespace App\Http\Controllers\Hosts;

use App\Attributes\Bus\Dispatches;
use App\Commands\Hosts\ClaimHostOrders\ClaimHostOrdersCommand;
use App\Contracts\Bus\CommandBus;
use App\Support\Hosts\HostWake;
use App\Values\HostContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * The host's long poll: it takes the orders waiting for it, or when none waits it waits until one is made, at most
 * the seconds it asked.
 */
final readonly class ClaimOrdersController
{
    /**
     * The longest a host's claim waits for an order.
     */
    public const int WAIT_LIMIT_SECONDS = 25;

    /**
     * The most orders one claim takes.
     */
    public const int CLAIM_LIMIT = 50;

    #[Dispatches(ClaimHostOrdersCommand::class)]
    public function __invoke(Request $request, HostContext $host, CommandBus $commands, HostWake $wake): JsonResponse
    {
        $request->validate([
            'limit' => ['sometimes', 'integer', 'min:1', 'max:'.self::CLAIM_LIMIT],
            'wait' => ['sometimes', 'integer', 'min:0', 'max:'.self::WAIT_LIMIT_SECONDS],
        ]);

        $claim = new ClaimHostOrdersCommand($host->hostId, $request->integer('limit', self::CLAIM_LIMIT));
        $claimed = $commands->run($claim);
        $wait = $request->integer('wait');

        if ($claimed->isEmpty() && $wait > 0 && $wake->waitForHost($host->hostId, $wait)) {
            $claimed = $commands->run($claim);
        }

        return new JsonResponse($claimed);
    }
}
