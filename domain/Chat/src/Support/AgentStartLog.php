<?php

declare(strict_types=1);

namespace Domain\Chat\Support;

use App\Agents\Drivers\Enums\DriverOperation;
use App\Agents\Drivers\Enums\RequestProgress;
use App\Agents\Drivers\Enums\RetriedAction;
use App\Agents\Drivers\Enums\RetryOutcome;
use App\Hosts\Enums\HostProcessStatus;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use App\Models\Drivers\DriverRequest;
use App\Models\Drivers\RetryAttempt;
use App\Models\Hosts\HostProcess;
use App\Models\Sessions\SessionProcess;
use App\Values\RetrySchedule;
use App\Values\ShownShellLine;
use Carbon\CarbonImmutable;
use Domain\Chat\Data\AgentLogData;
use Domain\Chat\Data\AgentLogLineData;
use Domain\Chat\Data\AgentLogStartData;
use Domain\Chat\Enums\AgentLogLineType;

/**
 * An agent's technical log from the journal's own records: each newest session as one start, with its refusals, its
 * processes and how they ended, its wakes and turns, in plain words, never an id, a server path or a request number.
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

        if ($session === null) {
            return [];
        }

        return array_reverse($this->startOf($session)->lines);
    }

    private function startOf(AgentSession $session): AgentLogStartData
    {
        $starts = array_values(SessionProcess::query()
            ->supervised()
            ->ofSessions([$session->id])
            ->limit(self::LINE_LIMIT)
            ->get()
            ->all());

        $attempts = RetryAttempt::query()->ofSession($session->id)->limit(self::LINE_LIMIT)->get();

        $gaveUp = array_values($attempts->filter(fn (RetryAttempt $attempt) => $attempt->outcome === RetryOutcome::GaveUp)
            ->map(fn (RetryAttempt $attempt) => $attempt->driver_request_id)->all());

        $lines = [
            ...$this->startLinesOf($starts, $this->runsOn($session)),
            ...$this->processLinesOf(array_map(fn (SessionProcess $start) => $start->id, $starts)),
            ...$this->requestLinesOf($session->id, $gaveUp),
            ...$this->retryLinesOf($attempts),
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
        $hasFailed = array_any($starts, fn (SessionProcess $start) => $start->isRefused());

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
     * What the session runs on in words, such as Claude Code · opus.
     */
    private function runsOn(AgentSession $session): string
    {
        return implode(' · ', array_filter([$session->driver_label, $session->model]));
    }

    /**
     * @param  list<SessionProcess>  $starts
     * @return list<AgentLogLineData>
     */
    private function startLinesOf(array $starts, string $runsOn): array
    {
        $lines = [];

        foreach ($starts as $start) {
            $lines[] = $this->line(
                $start->id.'-asked',
                $start->created_at,
                AgentLogLineType::StartAsked,
                $runsOn,
            );

            if ($start->isRefused()) {
                $lines[] = $this->failure(
                    $start->id.'-refused',
                    $start->ended_at ?? $start->updated_at,
                    AgentLogLineType::StartRefused,
                    (string) $start->refusal,
                    "{$runsOn} · account {$start->account_type}",
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
            $detail = ucfirst($process->purpose->label()).$this->tookOf($process->created_at, $process->started_at);

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
                    "The {$process->purpose->label()} {$this->endedOf($process)}",
                    implode(' · ', array_filter([
                        "exit status {$process->exit_code}",
                        $process->exit_signal === null ? null : "signal {$process->exit_signal}",
                        $process->exit_evidence,
                    ])),
                );
        }

        return $lines;
    }

    /**
     * @param  list<string|null>  $gaveUp
     * @return list<AgentLogLineData>
     */
    private function requestLinesOf(string $sessionId, array $gaveUp): array
    {
        $requests = DriverRequest::query()
            ->ofAgentRuntimes(AgentRuntime::query()->ofSessions([$sessionId])->runtimeIds())
            ->withAnyOperation([DriverOperation::Wake, DriverOperation::Deliver])
            ->limit(self::LINE_LIMIT)
            ->get();

        $lines = [];

        foreach ($requests as $request) {
            $isWake = $request->operation === DriverOperation::Wake;
            $failed = in_array($request->progress, [RequestProgress::Failed, RequestProgress::Unavailable], true);

            if ($failed) {
                if (in_array($request->id, $gaveUp, true)) {
                    continue;
                }

                $lines[] = $this->failure(
                    $request->id,
                    $request->updated_at,
                    $isWake ? AgentLogLineType::WakeFailed : AgentLogLineType::TurnFailed,
                    $request->refusal_reason?->startReason()->explanation()
                        ?? ($isWake ? 'The agent did not answer its wake.' : 'The turn did not go through.'),
                    implode(' · ', array_filter([
                        $request->operation->value,
                        $request->progress->value,
                        $request->outcome?->value,
                    ])),
                );

                continue;
            }

            if ($request->progress === RequestProgress::Applied) {
                $lines[] = $isWake
                    ? $this->line(
                        $request->id,
                        $request->updated_at,
                        AgentLogLineType::Woke,
                        'answered'.$this->tookOf($request->created_at, $request->updated_at, ' in '),
                    )
                    : $this->line(
                        $request->id,
                        $request->updated_at,
                        AgentLogLineType::TurnOpened,
                        'your message went in',
                    );
            }
        }

        return $lines;
    }

    /**
     * @param  iterable<RetryAttempt>  $attempts
     * @return list<AgentLogLineData>
     */
    private function retryLinesOf(iterable $attempts): array
    {
        $lines = [];

        foreach ($attempts as $attempt) {
            $action = $attempt->action->label();
            $number = "{$attempt->retry} of ".RetrySchedule::RETRY_LIMIT;
            $detail = "{$action} failed · {$attempt->failure} · attempt {$number} · wait {$attempt->wait_seconds} s";
            $lines[] = $this->line($attempt->id.'-retry', $attempt->created_at, AgentLogLineType::Retrying, $detail);

            if ($attempt->outcome === RetryOutcome::GaveUp) {
                $lines[] = $this->failure(
                    $attempt->id,
                    $attempt->updated_at,
                    AgentLogLineType::GaveUp,
                    "{$action} failed after {$attempt->retry} retries.",
                    $attempt->evidence ?? $attempt->failure,
                );
            }

            if ($attempt->outcome === RetryOutcome::Succeeded) {
                $type = $attempt->action === RetriedAction::Wake ? AgentLogLineType::Woke : AgentLogLineType::TurnOpened;
                $lines[] = $this->line($attempt->id, $attempt->updated_at, $type, "Succeeded on attempt {$number}");
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

    /**
     * How long a step took, in seconds with one decimal, after the joiner given; nothing when either moment is unknown.
     */
    private function tookOf(CarbonImmutable|null $from, CarbonImmutable|null $to, string $joiner = ' · '): string
    {
        if ($from === null || $to === null) {
            return '';
        }

        return $joiner.number_format(abs($to->diffInMilliseconds($from)) / 1000, 1).' s';
    }

    /**
     * How the host saw the process end, without its own evidence: its exit status, or its loss.
     */
    private function endedOf(HostProcess $process): string
    {
        if ($process->status === HostProcessStatus::Lost) {
            return 'was lost';
        }

        return "exited with status {$process->exit_code}";
    }

    private function timeOf(CarbonImmutable|null $at): string
    {
        return ($at ?? CarbonImmutable::now())->toIso8601String();
    }
}
