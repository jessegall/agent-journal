<?php

declare(strict_types=1);

namespace App\Hosts;

use App\Exceptions\HostProtocolRefused;
use App\Exceptions\WorkerFenced;
use App\Hosts\Exceptions\HostProtocolUnsupported;
use App\Hosts\Protocol\HostOrderType;
use App\Hosts\Protocol\HostProtocol;
use App\Hosts\Values\HostOrderBody;
use App\Models\Hosts\HostOrder;
use App\Models\Hosts\HostProcess;
use App\Models\Projects\Host;
use App\Time\Contracts\ServerClock;
use App\Values\HostOrderSource;
use App\Values\HostProcessPlan;

/**
 * Makes an order for a running process or for its host, inside the command's transaction: the process is locked, a
 * worker that was replaced is refused, and an order made before under the same key is the answer instead of a second.
 */
final readonly class HostOrderPlacement
{
    /**
     * How long an order other than a key write may wait for its host.
     */
    public const int ORDER_SECONDS = 30;

    /**
     * How long a key write may wait: keys typed late land on a screen that has moved on.
     */
    public const int KEY_SECONDS = 5;

    public function __construct(private ServerClock $clock, private HostCallReader $reader) {}

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
        $payload = $plan->payload();
        $this->reader->assertValid($payload, 'open plan');
        $this->assertContainedRules($plan);
        $order = $this->place($host, $process, HostOrderBody::from($plan->orderType(), $payload->toArray(), $source));
        $process->holdOpenOrder($order->id);

        return $order;
    }

    /**
     * An order about the host as a whole, which belongs to no process, such as a read of a connected project's folder.
     *
     * @param  array<string, mixed>  $payload
     *
     * @throws HostProtocolRefused
     */
    public function forHost(string $hostId, HostOrderSource $source, HostOrderType $type, array $payload): HostOrder
    {
        $host = $this->orderingHost($hostId);

        return $this->place($host, null, HostOrderBody::from($type, $payload, $source));
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
     * A contained plan names nothing of the host and carries its start grant whole.
     *
     * @throws HostProtocolRefused
     */
    private function assertContainedRules(HostProcessPlan $plan): void
    {
        if ($plan->container === null) {
            return;
        }

        if ($plan->hostFieldsNamed() !== []) {
            throw HostProtocolRefused::containedPlanNamesHost($plan->hostFieldsNamed());
        }

        if ($plan->missingGrantVariables() !== []) {
            throw HostProtocolRefused::containedGrantPartial($plan->missingGrantVariables());
        }
    }

    /**
     * @throws HostProtocolRefused
     */
    private function assertOrders(Host $host): void
    {
        if ($host->isRevoked()) {
            throw HostProtocolRefused::revoked($host->id);
        }

        if (! $host->acceptsProtocol(HostProtocol::VERSION)) {
            throw HostProtocolUnsupported::forHost($host->id, $host->protocol);
        }
    }

    private function place(
        Host $host,
        HostProcess|null $process,
        HostOrderBody $body,
        int $seconds = self::ORDER_SECONDS,
    ): HostOrder {
        if (! $host->carriesOut($body->type)) {
            throw HostProtocolRefused::lacksCapability($host->id, $body->type);
        }

        $known = HostOrder::findWithKey($body->idempotencyKey);

        if ($known !== null) {
            return $known;
        }

        // The process numbers its orders under its own lock, so the order takes the next number before it is made; an
        // order about the host waits on no other order, so it takes none.
        $sequence = $process === null ? 0 : $process->takeOrderNumber();

        return HostOrder::create($host, $process, $body, $this->clock->now()->addSeconds($seconds), $sequence);
    }
}
