<?php

declare(strict_types=1);

namespace App\Sharing\Console;

use App\Processes\Execution\SpawnedProcess;
use App\Sharing\Exceptions\GatewayRunStale;
use App\Sharing\Support\SharingSupervisor;
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

    private bool $stopping = false;

    /**
     * @param  array{health_seconds: int, expiry_seconds: int, audit_prune_seconds: int}  $timers
     */
    public function handle(
        SharingSupervisor $supervisor,
        #[Config('sharing.listener.host')] string $host,
        #[Config('sharing.listener.port')] int $port,
        #[Config('sharing.timers')] array $timers,
    ): int {
        $listener = SpawnedProcess::start([PHP_BINARY, '-q', '-S', "{$host}:{$port}", base_path('bootstrap/sharing-server.php')], [0 => ['file', '/dev/null', 'r'], 1 => ['file', '/dev/null', 'w'], 2 => ['file', '/dev/null', 'w']], base_path(), $this->listenerEnvironment());

        if (is_string($listener)) {
            $this->error("The share-only listener could not start: {$listener}");

            return self::FAILURE;
        }

        pcntl_async_signals(true);
        pcntl_signal(SIGTERM, fn () => $this->stopping = true);
        pcntl_signal(SIGINT, fn () => $this->stopping = true);
        $supervisor->begin();
        $this->info("Sharing supervisor run {$supervisor->runId} on {$host}:{$port}.");
        $due = ['health' => 0, 'expiry' => 0, 'prune' => 0];
        $healthy = true;

        while (! $this->stopping && $healthy) {
            $healthy = ! $listener->hasEnded() && $this->workAll($supervisor);
            $now = time();
            $due = $this->runTimers($supervisor, $timers, $due, $now);
            sleep(1);
        }

        $supervisor->stopAll();
        $stopped = $listener->stopGroup(self::LISTENER_GRACE_SECONDS);

        return $healthy && $stopped ? self::SUCCESS : self::FAILURE;
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
     * Runs each timer whose time came and answers when each runs next.
     *
     * @param  array{health_seconds: int, expiry_seconds: int, audit_prune_seconds: int}  $timers
     * @param  array{health: int, expiry: int, prune: int}  $due
     * @return array{health: int, expiry: int, prune: int}
     */
    private function runTimers(SharingSupervisor $supervisor, array $timers, array $due, int $now): array
    {
        if ($now >= $due['health']) {
            $supervisor->checkHealth();
            $due['health'] = $now + $timers['health_seconds'];
        }

        if ($now >= $due['expiry']) {
            $supervisor->expire();
            $due['expiry'] = $now + $timers['expiry_seconds'];
        }

        if ($now >= $due['prune']) {
            $supervisor->pruneAudit();
            $due['prune'] = $now + $timers['audit_prune_seconds'];
        }

        return $due;
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
