<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Actors\Contracts\ServerClock;
use App\Agents\Commands\ReportRuntimeScreen;
use App\Agents\Data\ScreenReportData;
use App\Agents\Enums\ScreenReportRefusal;
use App\Agents\Models\AgentRuntime;
use App\Agents\Support\RuntimeScreen;
use App\Agents\Support\ScreenRegistration;
use App\Agents\Support\ScreenReportAnswer;
use App\Agents\Support\WatchedRuntimes;
use App\Contracts\CommandHandler;
use Illuminate\Contracts\Cache\Repository;
use Psr\Log\LoggerInterface;

/**
 * Stores a frame only for a runtime the host runs and somebody watches, within the size bound and the frame rate, and
 * only when it is of the runtime's current screen identity; a refusal stores nothing and is logged at most once a
 * minute, never with the screen. The runtime's row stays locked while the frame is admitted, so a registration change
 * never interleaves with it.
 */
final readonly class ReportRuntimeScreenHandler implements CommandHandler
{
    /**
     * The most bytes one screen report may take.
     */
    public const int BYTE_LIMIT = 256 * 1024;

    /**
     * The most frames of one runtime kept in one second.
     */
    public const int FRAMES_PER_SECOND_LIMIT = 4;

    public function __construct(
        private WatchedRuntimes $watched,
        private RuntimeScreen $screens,
        private Repository $cache,
        private ServerClock $clock,
        private LoggerInterface $log,
    ) {}

    public function handle(ReportRuntimeScreen $command): ScreenReportAnswer
    {
        if (strlen($command->body) > self::BYTE_LIMIT) {
            return $this->refuse($command->hostId, '', ScreenReportRefusal::TooLarge);
        }

        $report = ScreenReportData::from(json_decode($command->body, true, flags: JSON_THROW_ON_ERROR));
        $runtime = AgentRuntime::query()->whereKey($report->runtimeId)->where('host_id', $command->hostId)
            ->lockForUpdate()->first();

        if ($runtime === null) {
            return $this->refuse($command->hostId, $report->runtimeId, ScreenReportRefusal::NotYourRuntime);
        }

        $refusal = $this->refusalOf($command->hostId, $report->runtimeId);

        if ($refusal !== null) {
            return $this->refuse($command->hostId, $report->runtimeId, $refusal);
        }

        $now = $this->clock->now();

        if (! $this->screens->admit(ScreenRegistration::of($runtime), $report->frame, $now)) {
            return $this->refuse($command->hostId, $report->runtimeId, ScreenReportRefusal::Retired);
        }

        $this->cache->add($this->rateKey($report->runtimeId, $now->getTimestamp()), 0, 2);
        $this->cache->increment($this->rateKey($report->runtimeId, $now->getTimestamp()));

        return ScreenReportAnswer::stored();
    }

    private function refusalOf(string $hostId, string $runtimeId): ScreenReportRefusal|null
    {
        if (! $this->watched->isWatched($hostId, $runtimeId)) {
            return ScreenReportRefusal::NotWatched;
        }

        $second = $this->clock->now()->getTimestamp();

        if ((int) $this->cache->get($this->rateKey($runtimeId, $second), 0) >= self::FRAMES_PER_SECOND_LIMIT) {
            return ScreenReportRefusal::TooFast;
        }

        return null;
    }

    private function rateKey(string $runtimeId, int $second): string
    {
        return "runtime-screen-rate:{$runtimeId}:{$second}";
    }

    /**
     * Refuses the frame and logs the refusal at most once a minute per host, runtime and reason, never the screen.
     */
    private function refuse(string $hostId, string $runtimeId, ScreenReportRefusal $refusal): ScreenReportAnswer
    {
        $guard = "runtime-screen-refusal:{$hostId}:{$runtimeId}:{$refusal->value}";

        if ($this->cache->add($guard, true, 60)) {
            $this->log->warning('A screen report was refused.', [
                'host_id' => $hostId,
                'runtime_id' => $runtimeId,
                'reason' => $refusal->value,
            ]);
        }

        return ScreenReportAnswer::refused($refusal);
    }
}
