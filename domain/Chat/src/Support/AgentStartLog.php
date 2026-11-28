<?php

declare(strict_types=1);

namespace Domain\Chat\Support;

use App\Agents\Drivers\Enums\DriverOperation;
use App\Agents\Drivers\Enums\RequestProgress;
use App\Hosts\Enums\HostProcessStatus;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use App\Models\Drivers\DriverRequest;
use App\Models\Hosts\HostProcess;
use App\Models\Sessions\SessionProcess;
use App\Values\ShownShellLine;
use Carbon\CarbonImmutable;
use Domain\Chat\Data\AgentLogData;
use Domain\Chat\Data\AgentLogLineData;
use Domain\Chat\Data\AgentLogStartData;
use Domain\Chat\Enums\AgentLogLineType;

/**
 * An agent's technical log, read from the journal's own records: each of its newest sessions as one start, with the
 * starts the host was asked for and their refusals, the host processes that ran for them and how they ended, and the
 * wakes and turns its driver was handed and how they went. Evidence is masked as shell lines are.
 */
final readonly class AgentStartLog
{
    /**
     * The most starts the log reads.
     */
    public const int START_LIMIT = 10;

    /**
     * The most lines of one kind a start reads.
     */
    private const int LINE_LIMIT = 50;

    public function of(string $agentId): AgentLogData
    {
        $sessions = AgentSession::query()->ofAgent($agentId)->newestCreatedFirst()->limit(self::START_LIMIT)->get();

        return AgentLogData::from([
            'agentId' => $agentId,
            'starts' => array_values($sessions->map(fn (AgentSession $session) => $this->startOf($session))->all()),
        ]);
    }

    /**
     * The lines of the agent's newest start, oldest first, as the chat shows them around the agent's turns.
     *
     * @return list<AgentLogLineData>
     */
    public function newestStartLines(string $agentId): array
    {
        $session = AgentSession::query()->ofAgent($agentId)->newestCreatedFirst()->first();

        return $session === null ? [] : array_reverse($this->startOf($session)->lines);
    }

    private function startOf(AgentSession $session): AgentLogStartData
    {
        $starts = SessionProcess::query()->supervised()->ofSessions([$session->id])->limit(self::LINE_LIMIT)->get();
        $lines = [
            ...$this->startLinesOf($starts->all()),
            ...$this->processLinesOf($starts->pluck('id')->all()),
            ...$this->requestLinesOf($session->id),
        ];

        if ($session->hasEnded()) {
            $lines[] = $this->line(
                $session->id.'-ended',
                $session->ended_at,
                AgentLogLineType::StartEnded,
                (string) $session->end_evidence,
            );
        }

        usort($lines, fn (AgentLogLineData $first, AgentLogLineData $second) => strcmp($second->at, $first->at));
        $hasFailed = $starts->contains(fn (SessionProcess $start) => $start->isRefused());

        return AgentLogStartData::from([
            'sessionId' => $session->id,
            'startedAt' => $this->timeOf($session->created_at),
            'outcome' => $this->outcomeOf($session, $hasFailed),
            'hasFailed' => $hasFailed,
            'lines' => $lines,
        ]);
    }

    private function outcomeOf(AgentSession $session, bool $hasFailed): string
    {
        if ($hasFailed) {
            return 'Failed';
        }

        if ($session->hasEnded()) {
            return 'Ended at '.$session->ended_at?->format('H:i');
        }

        return 'Started';
    }

    /**
     * @param  list<SessionProcess>  $starts
     * @return list<AgentLogLineData>
     */
    private function startLinesOf(array $starts): array
    {
        $lines = [];

        foreach ($starts as $start) {
            $lines[] = $this->line(
                $start->id.'-asked',
                $start->created_at,
                AgentLogLineType::StartAsked,
                $start->directory,
            );

            if ($start->isRefused()) {
                $lines[] = $this->failure(
                    $start->id.'-refused',
                    $start->ended_at ?? $start->updated_at,
                    AgentLogLineType::StartRefused,
                    (string) $start->refusal,
                    "start {$start->id} · account {$start->account_type} · {$start->directory}",
                );
            }
        }

        return $lines;
    }

    /**
     * @param  list<string>  $startIds
     * @return list<AgentLogLineData>
     */
    private function processLinesOf(array $startIds): array
    {
        $lines = [];

        foreach (HostProcess::query()->ofStarts($startIds)->limit(self::LINE_LIMIT)->get() as $process) {
            $detail = "{$process->purpose->label()} · {$process->container_name}";
            $lines[] = $this->line(
                $process->id.'-started',
                $process->started_at ?? $process->created_at,
                AgentLogLineType::ProcessStarted,
                $detail,
            );

            if (! in_array($process->status, [HostProcessStatus::Exited, HostProcessStatus::Lost], true)) {
                continue;
            }

            $lines[] = $process->exit_code === 0
                ? $this->line($process->id.'-ended', $process->ended_at, AgentLogLineType::ProcessEnded, $detail)
                : $this->failure(
                    $process->id.'-failed',
                    $process->ended_at,
                    AgentLogLineType::ProcessFailed,
                    "The {$process->purpose->label()} {$process->end_evidence}",
                    "{$detail} · exit code {$process->exit_code} · signal {$process->exit_signal}",
                );
        }

        return $lines;
    }

    /**
     * @return list<AgentLogLineData>
     */
    private function requestLinesOf(string $sessionId): array
    {
        $requests = DriverRequest::query()
            ->ofAgentRuntimes(AgentRuntime::query()->ofSessions([$sessionId])->select('id'))
            ->withAnyOperation([DriverOperation::Wake, DriverOperation::Deliver])
            ->limit(self::LINE_LIMIT)
            ->get();
        $lines = [];

        foreach ($requests as $request) {
            $isWake = $request->operation === DriverOperation::Wake;
            $failed = in_array($request->progress, [RequestProgress::Failed, RequestProgress::Unavailable], true);

            if ($failed) {
                $lines[] = $this->failure(
                    $request->id,
                    $request->updated_at,
                    $isWake ? AgentLogLineType::WakeFailed : AgentLogLineType::TurnFailed,
                    $request->refusal_reason?->value ?? $request->outcome?->value ?? $request->progress->value,
                    "request {$request->id} · {$request->operation->value} · {$request->progress->value}",
                );

                continue;
            }

            if ($request->progress === RequestProgress::Applied) {
                $type = $isWake ? AgentLogLineType::Woke : AgentLogLineType::TurnOpened;
                $lines[] = $this->line($request->id, $request->updated_at, $type, "request {$request->sequence}");
            }
        }

        return $lines;
    }

    private function line(
        string $id,
        CarbonImmutable|null $at,
        AgentLogLineType $type,
        string $detail,
    ): AgentLogLineData {
        return AgentLogLineData::from([
            'id' => $id,
            'at' => $this->timeOf($at),
            'type' => $type,
            'title' => $type->title(),
            'detail' => ShownShellLine::of($detail),
            'isFailure' => false,
            'reason' => null,
            'evidence' => null,
        ]);
    }

    private function failure(
        string $id,
        CarbonImmutable|null $at,
        AgentLogLineType $type,
        string $reason,
        string $evidence,
    ): AgentLogLineData {
        return AgentLogLineData::from([
            'id' => $id,
            'at' => $this->timeOf($at),
            'type' => $type,
            'title' => $type->title(),
            'detail' => ShownShellLine::of($reason),
            'isFailure' => true,
            'reason' => ShownShellLine::of($reason),
            'evidence' => ShownShellLine::of($evidence),
        ]);
    }

    private function timeOf(CarbonImmutable|null $at): string
    {
        return ($at ?? CarbonImmutable::now())->toIso8601String();
    }
}
