<?php

declare(strict_types=1);

namespace App\Support;

use App\Commands\Sharing\ClaimGatewayOperation\ClaimGatewayOperationCommand;
use App\Commands\Sharing\ExpireShares\ExpireSharesCommand;
use App\Commands\Sharing\PruneShareAudit\PruneShareAuditCommand;
use App\Commands\Sharing\RecordGatewayHealth\RecordGatewayHealthCommand;
use App\Commands\Sharing\RecordGatewayOutcome\RecordGatewayOutcomeCommand;
use App\Commands\Sharing\ReopenSharedGateways\ReopenSharedGatewaysCommand;
use App\Contracts\Bus\Command;
use App\Contracts\Sharing\ShareGateway;
use App\Enums\CommandEntry;
use App\Enums\GatewayOperationType;
use App\Enums\GatewayOutcome;
use App\Exceptions\GatewayLeaseRefused;
use App\Exceptions\GatewayOpenFailed;
use App\Exceptions\GatewayRunStale;
use App\Exceptions\SupervisorInsideTransaction;
use App\Models\Sharing\ShareGatewayEndpoint;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Support\Str;
use Psr\Log\LoggerInterface;

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
        private readonly LoggerInterface $log,
    ) {
        $this->runId = Str::ulid()->toBase32();
    }

    /**
     * Takes the gateways over for this run and requests an open of every configuration that serves a live share;
     * answers how many it requested.
     */
    public function begin(): int
    {
        return $this->asSystem(new ReopenSharedGatewaysCommand($this->runId));
    }

    /**
     * Carries out one waiting gateway operation; answers whether there was one.
     *
     * @throws GatewayRunStale when a newer run holds the gateways
     */
    public function work(): bool
    {
        $this->assertNoTransaction();
        $claim = $this->asSystem(new ClaimGatewayOperationCommand($this->runId));

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
            $this->asSystem(RecordGatewayOutcomeCommand::of($claim->operation, $outcome));
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
                new RecordGatewayHealthCommand(
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
            $expiry = $this->asSystem(new ExpireSharesCommand());
        } while ($expiry->hasMore);
    }

    /**
     * Prunes the audit past its retention, a hundred rows at a time until none waits.
     */
    public function pruneAudit(): void
    {
        do {
            $pruning = $this->asSystem(new PruneShareAuditCommand());
        } while ($pruning->hasMore);
    }

    /**
     * Stops every program this run started, when the supervisor ends.
     */
    public function stopAll(): void
    {
        foreach (ShareGatewayEndpoint::openOfRun($this->runId) as $endpoint) {
            $this->gateways->get($endpoint->gatewayKey())->close($endpoint->toGatewayEndpoint);
        }
    }

    private function open(ShareGateway $gateway, GatewayOperation $operation): GatewayOutcome
    {
        try {
            $gateway->open($operation);
        } catch (GatewayOpenFailed $failure) {
            $this->log->error(
                "A share gateway did not open: {$failure->getMessage()}",
                ['operation' => $operation->operationId, 'exception' => $failure],
            );

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
