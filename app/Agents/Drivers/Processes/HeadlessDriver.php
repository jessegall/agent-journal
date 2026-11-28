<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Processes;

use App\Accounts\Commands\AddUsageCost\AddUsageCostCommand;
use App\Accounts\Commands\RecordThreadTokens\RecordThreadTokensCommand;
use App\Accounts\Commands\RecordUsageWindow\RecordUsageWindowCommand;
use App\Agents\Commands\ChooseRuntimeConversation\ChooseRuntimeConversationCommand;
use App\Agents\Commands\OpenHeadlessTurn\OpenHeadlessTurnCommand;
use App\Agents\Drivers\Commands\NotifyRequestProgress\NotifyRequestProgressCommand;
use App\Agents\Drivers\Commands\NotifyRuntimeActivity\NotifyRuntimeActivityCommand;
use App\Agents\Drivers\Contracts\ProcessDriver;
use App\Agents\Drivers\Contracts\TurnResult;
use App\Agents\Drivers\Enums\DriverOperation;
use App\Agents\Drivers\Enums\RequestProgress;
use App\Agents\Drivers\Setup\DriverProfiles;
use App\Hosts\Commands\CloseHostInput\CloseHostInputCommand;
use App\Hosts\Commands\SignalHostProcess\SignalHostProcessCommand;
use App\Hosts\Commands\StopHostProcess\StopHostProcessCommand;
use App\Hosts\Protocol\HostInstructionType;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\DriverRequest;
use App\Models\Hosts\HostInstruction;
use App\Models\Hosts\HostProcess;
use App\Processes\Enums\RuntimeActivity;
use App\Support\Command;
use App\Time\Contracts\ServerClock;
use App\Values\ClaimedRequest;
use App\Values\DriverActions;
use App\Values\FeedEntry;
use App\Values\HostInstructionSource;
use App\Values\ReportedStart;
use App\Values\ThreadTokens;
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

    private readonly TurnResult $result;

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
        DriverProfiles $profiles,
    ) {
        $runtime = AgentRuntime::query()->findOrFail($process->agent_runtime_id);
        $this->result = $profiles->of($runtime)->turnResult($process->id);
    }

    public function resume(array $inFlight, array $ordered): DriverActions
    {
        foreach ($ordered as $instruction) {
            $this->isInputClosed = $this->isInputClosed || $instruction->type === HostInstructionType::CloseStdin;
        }

        return DriverActions::of($this->activity(RuntimeActivity::Running))->then($this->closeInput());
    }

    public function onOutput(FeedEntry $entry): DriverActions
    {
        if ($entry->chunk?->stream !== 'stdout') {
            return DriverActions::none();
        }

        $usage = $this->result->read($entry->printed(), $this->clock->now());

        return DriverActions::of(...array_map($this->usageCommand(...), $usage));
    }

    public function onRequest(ClaimedRequest $request): DriverActions
    {
        $source = HostInstructionSource::forStep(
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

    public function onAnswer(HostInstruction $instruction): DriverActions
    {
        return DriverActions::none();
    }

    /**
     * @param  Command<mixed>  $command
     */
    public function onAnswered(Command $command, mixed $answer): DriverActions
    {
        return DriverActions::none();
    }

    public function onExit(): DriverActions
    {
        $process = $this->process->refresh();
        $end = $this->result->end($process->exit_code, $process->exit_evidence);
        $end = $this->interrupts === [] ? $end : $end->interrupted();
        $reports = [];
        $turn = $this->turnRequest();

        if ($turn !== null) {
            $reports[] = $this->endReport($turn->id, $turn->attempt_version, $end);
        }

        foreach ($this->interrupts as $requestId => $attempt) {
            $reports[] = $this->endReport($requestId, $attempt, $end);
        }

        return DriverActions::of(...[
            ...$this->namedConversation(),
            $this->activity(RuntimeActivity::Idle),
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
        $source = HostInstructionSource::forStep(
            $turn->id,
            self::CLOSE_INPUT,
            $turn->attempt_version,
            $this->generation,
        );

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

    private function interrupt(ClaimedRequest $request, HostInstructionSource $source): DriverActions
    {
        $this->interrupts[$request->requestId] = $request->attempt;

        return DriverActions::of(new SignalHostProcessCommand($this->process->id, 'SIGINT', $source));
    }

    /**
     * What the runtime does now, as its turn shows it: running while the turn runs, idle once it ended; a hold the
     * runtime has, such as an interrupt the user releases, stays.
     */
    private function activity(RuntimeActivity $activity): NotifyRuntimeActivityCommand
    {
        $runtime = AgentRuntime::query()->whereKey($this->process->agent_runtime_id)->sole();

        return new NotifyRuntimeActivityCommand(
            $this->process->host_id,
            $runtime->id,
            $activity,
            $runtime->hold_reason,
            $runtime->process_generation,
        );
    }

    private function endReport(string $requestId, int $attempt, TurnEnd $end): NotifyRequestProgressCommand
    {
        return new NotifyRequestProgressCommand(
            $this->process->host_id,
            $requestId,
            $attempt,
            $end->progress(),
            $this->result->conversation() ?? $this->conversation(),
            $end->outcome(),
            turnEnd: $end,
        );
    }

    private function usageCommand(
        UsageWindowReading|UsageCost|ThreadTokens $usage,
    ): AddUsageCostCommand|RecordUsageWindowCommand|RecordThreadTokensCommand {
        $session = $this->process->sessionProcess()->sole();
        $start = new ReportedStart($this->process->host_id, $session->start_key, $session->account_generation);

        return match (true) {
            $usage instanceof UsageCost => new AddUsageCostCommand($start, $usage),
            $usage instanceof ThreadTokens => new RecordThreadTokensCommand($start, $usage),
            default => new RecordUsageWindowCommand($start, $usage),
        };
    }

    /**
     * The request the turn was opened for: the one its open instruction was made for.
     */
    private function turnRequest(): DriverRequest|null
    {
        $requestId = HostInstruction::query()
            ->whereKey($this->process->open_instruction_id)
            ->value('driver_request_id');

        if ($requestId === null) {
            return null;
        }

        return DriverRequest::query()->whereKey($requestId)->first();
    }

    /**
     * The conversation every turn of the runtime continues, chosen when the journal opened it, which the turn's request
     * is applied to.
     */
    /**
     * The conversation the turn's driver started, such as a Codex thread, chosen for the runtime so its next turn
     * resumes it; none when the turn started none or continued the runtime's own.
     *
     * @return list<ChooseRuntimeConversationCommand>
     */
    private function namedConversation(): array
    {
        $named = $this->result->conversation();

        if ($named === null || $named === $this->conversation()) {
            return [];
        }

        return [new ChooseRuntimeConversationCommand((string) $this->process->agent_runtime_id, $named)];
    }

    private function conversation(): string|null
    {
        return $this->process->runtime?->conversation_id;
    }
}
