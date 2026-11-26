<?php

declare(strict_types=1);

namespace App\Support\Hosts;

use App\Contracts\Time\ServerClock;
use App\Enums\Hosts\HostOrderType;
use App\Exceptions\HostProtocolRefused;
use App\Exceptions\HostProtocolUnsupported;
use App\Exceptions\WorkerFenced;
use App\Models\Hosts\HostOrder;
use App\Models\Hosts\HostProcess;
use App\Models\Projects\Host;
use App\Values\HostOrderBody;
use App\Values\HostOrderSource;
use App\Values\HostProcessPlan;

/**
 * Makes an order for a running process or for its host, inside the command's transaction: the process is locked, a
 * worker that was replaced is refused, and an order made before under the same key is the answer instead of a second.
 */
final readonly class HostOrderPlacement
{
    /**
     * The protocol the journal orders hosts in.
     */
    public const int PROTOCOL = 1;

    /**
     * How long an order other than a key write may wait for its host.
     */
    public const int ORDER_SECONDS = 30;

    /**
     * How long a key write may wait: keys typed late land on a screen that has moved on.
     */
    public const int KEY_SECONDS = 5;

    public function __construct(private ServerClock $clock) {}

    /**
     * @param  array<string, mixed>  $payload
     *
     * @throws WorkerFenced
     * @throws HostProtocolRefused
     */
    public function forProcess(
        string $processId,
        HostOrderSource $source,
        HostOrderType $type,
        array $payload,
        int $expirySeconds = self::ORDER_SECONDS,
    ): HostOrder {
        $process = HostProcess::findLocked($processId);

        if ($source->workerGeneration !== null) {
            $process->assertWorker($source->workerGeneration);
        }

        if (! $process->isLive()) {
            throw HostProtocolRefused::notRunning($process->id);
        }

        if (! $type->suits($process->type)) {
            throw HostProtocolRefused::unsuited($process->id, $type, $process->type);
        }

        $host = $process->host;
        $this->assertOrders($host);

        return $this->place($host, $process, HostOrderBody::from($type, $payload, $source), $expirySeconds);
    }

    /**
     * The order that opens a process just made on the host.
     *
     * @throws HostProtocolRefused
     */
    public function forOpening(HostProcess $process, HostProcessPlan $plan, HostOrderSource $source): HostOrder
    {
        $host = $this->orderingHost($process->host_id);
        $order = $this->place($host, $process, HostOrderBody::from($plan->orderType(), $plan->payload(), $source));
        $process->holdOpenOrder($order->id);

        return $order;
    }

    /**
     * The host, locked, once it is known to take orders.
     *
     * @throws HostProtocolRefused
     * @throws HostProtocolUnsupported
     */
    public function orderingHost(string $hostId): Host
    {
        $host = Host::findLocked($hostId);
        $this->assertOrders($host);

        return $host;
    }

    /**
     * @throws HostProtocolRefused
     */
    private function assertOrders(Host $host): void
    {
        if ($host->isRevoked()) {
            throw HostProtocolRefused::revoked($host->id);
        }

        if (! $host->acceptsProtocol(self::PROTOCOL)) {
            throw HostProtocolUnsupported::forHost($host->id, $host->protocol);
        }
    }

    private function place(
        Host $host,
        HostProcess $process,
        HostOrderBody $body,
        int $seconds = self::ORDER_SECONDS,
    ): HostOrder {
        return HostOrder::findWithKey($body->idempotencyKey)
            ?? HostOrder::create($host, $process, $body, $this->clock->now()->addSeconds($seconds));
    }
}
