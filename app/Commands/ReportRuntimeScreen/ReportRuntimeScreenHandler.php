<?php

declare(strict_types=1);

namespace App\Commands\ReportRuntimeScreen;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Time\ServerClock;
use App\Data\Terminals\ScreenReportData;
use App\Enums\ScreenReportRefusal;
use App\Models\Agents\AgentRuntime;
use App\Support\RuntimeScreen;
use App\Support\ScreenRegistration;
use App\Support\ScreenReportAnswer;
use App\Support\TerminalControls;
use App\Support\WatchedRuntimes;
use Illuminate\Contracts\Cache\Repository;
use Psr\Log\LoggerInterface;

/**
 * Stores a frame only for a runtime the host runs and somebody watches, within the size bound and the frame rate, and
 * only when it is of the runtime's current screen identity; a refusal stores nothing and is logged at most once a
 * minute, never with the screen. The runtime's row stays locked while the frame is admitted, so a registration change
 * never interleaves with it. A frame of a new contained attachment ends every grant of the old one.
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
        private TerminalControls $controls,
    ) {}

    public function handle(ReportRuntimeScreenCommand $command): ScreenReportAnswer
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
        $registration = ScreenRegistration::of($runtime);
        $before = $this->screens->latest($registration);

        if (! $this->screens->admit($registration, $report->frame, $now)) {
            return $this->refuse($command->hostId, $report->runtimeId, ScreenReportRefusal::Retired);
        }

        if ($before !== null && $before->frame->attachment !== $report->frame->attachment) {
            $this->controls->revokeRuntime($runtime->load('session'), $now);
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
