<?php

declare(strict_types=1);

namespace App\Sharing\Support;

use App\Bus\Contracts\Command;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\EntryDispatchers;
use App\Sharing\Commands\ClaimGatewayOperation;
use App\Sharing\Commands\ExpireShares;
use App\Sharing\Commands\PruneShareAudit;
use App\Sharing\Commands\RecordGatewayHealth;
use App\Sharing\Commands\RecordGatewayOutcome;
use App\Sharing\Commands\ReopenSharedGateways;
use App\Sharing\Contracts\ShareGateway;
use App\Sharing\Enums\GatewayOperationType;
use App\Sharing\Enums\GatewayOutcome;
use App\Sharing\Exceptions\GatewayLeaseRefused;
use App\Sharing\Exceptions\GatewayOpenFailed;
use App\Sharing\Exceptions\GatewayRunStale;
use App\Sharing\Exceptions\SupervisorInsideTransaction;
use App\Sharing\Models\ShareGatewayEndpoint;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Support\Str;

/**
 * One run of the sharing supervisor, in three committed steps per gateway operation: it claims the operation through
 * the bus, opens or closes the gateway outside the bus and outside every transaction, and records the outcome through
 * the bus. A new run takes the gateways over and opens again every configuration that still serves a live share; a
 * run that lost them stops only the program it started. Every bus call runs as the System.
 */
final class SharingSupervisor
{
    public readonly string $runId;

    public function __construct(
        private readonly EntryDispatchers $dispatchers,
        private readonly ShareGatewayRegistry $gateways,
        private readonly ConnectionInterface $database,
    ) {
        $this->runId = Str::ulid()->toBase32();
    }

    /**
     * Takes the gateways over for this run and requests an open of every configuration that serves a live share;
     * answers how many it requested.
     */
    public function begin(): int
    {
        return $this->asSystem(new ReopenSharedGateways($this->runId));
    }

    /**
     * Carries out one waiting gateway operation; answers whether there was one.
     *
     * @throws GatewayRunStale when a newer run holds the gateways
     */
    public function work(): bool
    {
        $this->assertNoTransaction();
        $claim = $this->asSystem(new ClaimGatewayOperation($this->runId));

        if ($claim === null) {
            return false;
        }

        $endpoint = GatewayEndpoint::forOperation($claim->operation);
        $gateway = $this->gateways->forOperation($claim->operation);
        $outcome = $claim->type === GatewayOperationType::Open ? $this->open(
            $gateway,
            $claim->operation,
        ) : $this->close($gateway, $endpoint);

        try {
            $this->asSystem(RecordGatewayOutcome::of($claim->operation, $outcome));
        } catch (GatewayLeaseRefused|GatewayRunStale $lost) {
            $gateway->close($endpoint);

            throw $lost;
        }

        return true;
    }

    /**
     * Asks every endpoint this run opened whether it answers, and records each answer.
     */
    public function checkHealth(): void
    {
        foreach (ShareGatewayEndpoint::openOfRun($this->runId) as $endpoint) {
            $this->assertNoTransaction();
            $healthy = $this->gateways->healthOf($endpoint)->isHealthy();
            $this->asSystem(
                new RecordGatewayHealth(
                    $this->runId,
                    $endpoint->share_gateway_configuration_id,
                    $endpoint->endpoint_version,
                    $healthy,
                ),
            );
        }
    }

    /**
     * Expires every share past its deadline, a hundred at a time until none waits.
     */
    public function expire(): void
    {
        do {
            $expiry = $this->asSystem(new ExpireShares());
        } while ($expiry->hasMore);
    }

    /**
     * Prunes the audit past its retention, a hundred rows at a time until none waits.
     */
    public function pruneAudit(): void
    {
        do {
            $pruning = $this->asSystem(new PruneShareAudit());
        } while ($pruning->hasMore);
    }

    /**
     * Stops every program this run started, when the supervisor ends.
     */
    public function stopAll(): void
    {
        foreach (ShareGatewayEndpoint::openOfRun($this->runId) as $endpoint) {
            $this->gateways->get($endpoint->gatewayKey())->close($endpoint->toGatewayEndpoint());
        }
    }

    private function open(ShareGateway $gateway, GatewayOperation $operation): GatewayOutcome
    {
        try {
            $gateway->open($operation);
        } catch (GatewayOpenFailed) {
            return GatewayOutcome::Failed;
        }

        return GatewayOutcome::Succeeded;
    }

    private function close(ShareGateway $gateway, GatewayEndpoint $endpoint): GatewayOutcome
    {
        $gateway->close($endpoint);

        return GatewayOutcome::Succeeded;
    }

    /**
     * A gateway's program runs outside every transaction, so a commit never waits on it and a retry never repeats it.
     *
     * @throws SupervisorInsideTransaction
     */
    private function assertNoTransaction(): void
    {
        if ($this->database->transactionLevel() > 0) {
            throw SupervisorInsideTransaction::atLevel($this->database->transactionLevel());
        }
    }

    /**
     * @template TResult
     *
     * @param  Command<TResult>  $command
     * @return TResult
     */
    private function asSystem(Command $command): mixed
    {
        return $this->dispatchers->runAsJournal(CommandEntry::ShareGateway, 'sharing supervisor', $command);
    }
}
