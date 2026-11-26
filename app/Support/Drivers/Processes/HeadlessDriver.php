<?php

declare(strict_types=1);

namespace App\Support\Drivers\Processes;

use App\Commands\Accounts\AddUsageCost\AddUsageCostCommand;
use App\Commands\Accounts\RecordUsageWindow\RecordUsageWindowCommand;
use App\Commands\Agents\OpenHeadlessTurn\OpenHeadlessTurnCommand;
use App\Commands\Drivers\NotifyRequestProgress\NotifyRequestProgressCommand;
use App\Commands\Hosts\CloseHostInput\CloseHostInputCommand;
use App\Commands\Hosts\SignalHostProcess\SignalHostProcessCommand;
use App\Commands\Hosts\StopHostProcess\StopHostProcessCommand;
use App\Contracts\Drivers\ProcessDriver;
use App\Contracts\Time\ServerClock;
use App\Enums\Drivers\DriverOperation;
use App\Enums\Drivers\RequestProgress;
use App\Enums\Hosts\HostOrderType;
use App\Models\Drivers\DriverRequest;
use App\Models\Hosts\HostOrder;
use App\Models\Hosts\HostProcess;
use App\Values\ClaimedRequest;
use App\Values\DriverActions;
use App\Values\FeedEntry;
use App\Values\HostOrderSource;
use App\Values\ReportedStart;
use App\Values\TurnEnd;
use App\Values\UsageCost;
use App\Values\UsageWindowReading;

/**
 * Drives one headless turn: a pipe process opened for one request, whose prompt is in its argv. It closes the turn's
 * input, reads the result and usage from what the process prints, signals or stops the process for an interrupt or a
 * stop, and reports the turn's request, and each interrupt, with what the host saw when the process ended.
 */
final class HeadlessDriver implements ProcessDriver
{
    private const string CLOSE_INPUT = 'close-input';

    /**
     * How long a stopped turn gets to end, then how long before it is killed.
     */
    private const int STOP_GRACE_MS = 5000;

    private const int STOP_FORCE_MS = 5000;

    private readonly ClaudeResult $result;

    private bool $isInputClosed = false;

    /**
     * The interrupts claimed while the turn ran, by request id and attempt; each settles when the turn ends.
     *
     * @var array<string, int>
     */
    private array $interrupts = [];

    public function __construct(
        private readonly HostProcess $process,
        private readonly int $generation,
        private readonly ServerClock $clock,
    ) {
        $this->result = new ClaudeResult($process->id);
    }

    public function resume(array $inFlight, array $ordered): DriverActions
    {
        foreach ($ordered as $order) {
            $this->isInputClosed = $this->isInputClosed || $order->type === HostOrderType::CloseStdin;
        }

        return $this->closeInput();
    }

    public function onOutput(FeedEntry $entry): DriverActions
    {
        if ($entry->chunk?->stream !== 'stdout') {
            return DriverActions::none();
        }

        $usage = $this->result->read($entry->chunk->printed(), $this->clock->now());

        return DriverActions::of(...array_map($this->usageCommand(...), $usage));
    }

    public function onRequest(ClaimedRequest $request): DriverActions
    {
        $source = HostOrderSource::forStep(
            $request->requestId,
            $request->operation,
            $request->attempt,
            $this->generation,
        );

        return match (DriverOperation::tryFrom($request->operation)) {
            DriverOperation::Interrupt => $this->interrupt($request, $source),
            DriverOperation::Stop => DriverActions::of(
                new StopHostProcessCommand($this->process->id, self::STOP_GRACE_MS, self::STOP_FORCE_MS, $source),
            ),
            default => DriverActions::none(),
        };
    }

    public function onAnswer(HostOrder $order): DriverActions
    {
        return DriverActions::none();
    }

    public function onExit(): DriverActions
    {
        $process = $this->process->refresh();
        $end = $this->result->end($process->exit_code, $process->exit_evidence);
        $reports = [];
        $turn = $this->turnRequest();

        if ($turn !== null) {
            $reports[] = $this->endReport($turn->id, $turn->attempt_version, $end);
        }

        foreach ($this->interrupts as $requestId => $attempt) {
            $reports[] = $this->endReport($requestId, $attempt, $end);
        }

        return DriverActions::of(...[
            ...$reports,
            new OpenHeadlessTurnCommand((string) $process->agent_runtime_id),
        ]);
    }

    /**
     * The turn's input closes once, so the driver, which reads it to its end, goes on with the prompt in its argv.
     */
    private function closeInput(): DriverActions
    {
        $turn = $this->turnRequest();

        if ($this->isInputClosed || $turn === null) {
            return DriverActions::none();
        }

        $this->isInputClosed = true;
        $source = HostOrderSource::forStep($turn->id, self::CLOSE_INPUT, $turn->attempt_version, $this->generation);

        return DriverActions::of(
            new CloseHostInputCommand($this->process->id, $source),
            new NotifyRequestProgressCommand(
                $this->process->host_id,
                $turn->id,
                $turn->attempt_version,
                RequestProgress::Applying,
                null,
                null,
            ),
        );
    }

    private function interrupt(ClaimedRequest $request, HostOrderSource $source): DriverActions
    {
        $this->interrupts[$request->requestId] = $request->attempt;

        return DriverActions::of(new SignalHostProcessCommand($this->process->id, 'SIGINT', $source));
    }

    private function endReport(string $requestId, int $attempt, TurnEnd $end): NotifyRequestProgressCommand
    {
        return new NotifyRequestProgressCommand(
            $this->process->host_id,
            $requestId,
            $attempt,
            $end->progress(),
            $this->conversation(),
            $end->outcome(),
            turnEnd: $end,
        );
    }

    private function usageCommand(UsageWindowReading|UsageCost $usage): AddUsageCostCommand|RecordUsageWindowCommand
    {
        $session = $this->process->sessionProcess()->sole();
        $start = new ReportedStart($this->process->host_id, $session->start_key, $session->account_generation);

        if ($usage instanceof UsageCost) {
            return new AddUsageCostCommand($start, $usage);
        }

        return new RecordUsageWindowCommand($start, $usage);
    }

    /**
     * The request the turn was opened for: the one its open order was made for.
     */
    private function turnRequest(): DriverRequest|null
    {
        $requestId = HostOrder::query()->whereKey($this->process->open_order_id)->value('driver_request_id');

        if ($requestId === null) {
            return null;
        }

        return DriverRequest::query()->whereKey($requestId)->first();
    }

    /**
     * The conversation every turn of the runtime continues, chosen when the journal opened it, which the turn's request
     * is applied to.
     */
    private function conversation(): string|null
    {
        return $this->process->runtime?->conversation_id;
    }
}
