<?php

declare(strict_types=1);

namespace App\Support;

use App\Models\Sessions\ReportedBypass;
use App\Values\BypassReport;
use App\Values\LoggedBypass;
use Carbon\CarbonImmutable;

/**
 * Keeps the bypasses a start's host reports after the journal came back; they are facts, never fresh permission.
 */
final readonly class ReportedBypasses
{
    public function record(string $sessionId, BypassReport $report): void
    {
        $this->recordAll($sessionId, $report);
    }

    /**
     * Keeps every bypass of the report for the session in one insert.
     */
    private function recordAll(string $sessionId, BypassReport $report): void
    {
        $now = CarbonImmutable::now();

        ReportedBypass::query()->insert(array_map(fn (LoggedBypass $fact) => [
            'id' => new ReportedBypass()->newUniqueId(),
            'agent_session_id' => $sessionId,
            'native_event' => $fact->nativeEvent,
            'failure' => $fact->failure,
            'occurred_at' => $fact->occurredAt,
            'created_at' => $now,
            'updated_at' => $now,
        ], $report->bypasses));
    }
}
