<?php

declare(strict_types=1);

namespace Domain\Sharing\Console\Commands;

use App\Processes\Execution\SpawnedProcess;
use App\Support\SupervisorTimer;
use Domain\Sharing\Exceptions\GatewayRunStale;
use Domain\Sharing\Support\SharingSupervisor;
use Illuminate\Console\Command;
use Illuminate\Container\Attributes\Config;

/**
 * The share service's first process: it starts the share-only listener on loopback as its child, takes the gateways
 * over with a new run and reopens the configurations live shares need, then carries out gateway operations as they
 * come, checks health every 15 seconds, expires shares every minute and prunes the audit daily. SIGTERM or SIGINT
 * stops its programs and the listener; a listener that dies, a run another supervisor took over or a program that
 * cannot be stopped ends it with a failure, so the container restarts it.
 */
final class SuperviseSharingCommand extends Command
{
    private const int LISTENER_GRACE_SECONDS = 10;

    protected $signature = 'sharing:supervise';

    protected $description = 'Run the sharing supervisor: the share-only listener, gateway operations and timers';

    private bool $isStopping = false;

    public function handle(
        SharingSupervisor $supervisor,
        #[Config('sharing.listener.host')]
        string $host,
        #[Config('sharing.listener.port')]
        int $port,
        #[Config('sharing.timers.health_seconds')]
        int $healthSeconds,
        #[Config('sharing.timers.expiry_seconds')]
        int $expirySeconds,
        #[Config('sharing.timers.audit_prune_seconds')]
        int $auditPruneSeconds,
    ): int {
        $listener = SpawnedProcess::start(
            [PHP_BINARY, '-q', '-S', "{$host}:{$port}", base_path('domain/Sharing/bootstrap/server.php')],
            [0 => ['file', '/dev/null', 'r'], 1 => ['file', '/dev/null', 'w'], 2 => ['file', '/dev/null', 'w']],
            base_path(),
            $this->listenerEnvironment(),
        );

        if (is_string($listener)) {
            $this->error("The share-only listener could not start: {$listener}");

            return self::FAILURE;
        }

        pcntl_async_signals(true);
        pcntl_signal(SIGTERM, fn () => $this->isStopping = true);
        pcntl_signal(SIGINT, fn () => $this->isStopping = true);
        $supervisor->begin();
        $this->info("Sharing supervisor run {$supervisor->runId} on {$host}:{$port}.");

        $timers = [
            new SupervisorTimer($healthSeconds, $supervisor->checkHealth(...)),
            new SupervisorTimer($expirySeconds, $supervisor->expire(...)),
            new SupervisorTimer($auditPruneSeconds, $supervisor->pruneAudit(...)),
        ];

        $healthy = true;

        while (! $this->isStopping && $healthy) {
            $healthy = ! $listener->hasEnded() && $this->workAll($supervisor);
            $now = time();

            foreach ($timers as $timer) {
                $timer->runIfDue($now);
            }

            sleep(1);
        }

        $supervisor->stopAll();
        $stopped = $listener->stopGroup(self::LISTENER_GRACE_SECONDS);

        if ($healthy && $stopped) {
            return self::SUCCESS;
        }

        return self::FAILURE;
    }

    /**
     * Carries out every waiting gateway operation; false when another run took the gateways over.
     */
    private function workAll(SharingSupervisor $supervisor): bool
    {
        try {
            while ($supervisor->work()) {
                continue;
            }
        } catch (GatewayRunStale $taken) {
            $this->error($taken->getMessage());

            return false;
        }

        return true;
    }

    /**
     * The listener's environment: this process's own, so it reaches the same database and cache.
     *
     * @return array<string, string>
     */
    private function listenerEnvironment(): array
    {
        return getenv();
    }
}
