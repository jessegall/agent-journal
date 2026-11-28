<?php

declare(strict_types=1);

namespace App\Recordings;

use App\Hosts\HostChunks;
use App\Hosts\Protocol\HostInstructionType;
use App\Hosts\Protocol\HostProcessReportType;
use App\Hosts\Protocol\HostRoute;
use App\Hosts\Protocol\Payloads\HostClaimedInstructionsPayload;
use App\Hosts\Protocol\Payloads\HostInstructionPayload;
use App\Hosts\Protocol\Payloads\HostKeyWritePayload;
use App\Hosts\Protocol\Payloads\HostOpenPlanPayload;
use App\Hosts\Protocol\Payloads\HostOutputPayload;
use App\Hosts\Protocol\Payloads\HostProcessReportPayload;
use App\Hosts\Protocol\Payloads\HostStdinWritePayload;
use App\Hosts\Protocol\Payloads\HostTerminalSizePayload;
use App\Recordings\Enums\RecordedEventType;

/**
 * Cuts each driver's exchange out of a run's host exchange: an opening instruction opens it, the instructions to it are
 * what was typed (a private value only as typed) or resized, its relayed output what it printed, its report its end.
 */
final readonly class DriverExchanges
{
    /**
     * Every driver exchange of the host exchange, by its process, in the order each opened.
     *
     * @param  list<RecordedEvent>  $hostEvents
     * @return array<string, CutExchange>
     */
    public function cutFrom(array $hostEvents, RecordingFakes $fakes): array
    {
        $exchanges = [];

        foreach ($hostEvents as $event) {
            $exchanges = $this->withCall($exchanges, $event, $fakes);
        }

        return $exchanges;
    }

    /**
     * The exchanges after one host call: a claim's instructions, a process's output, or its report.
     *
     * @param  array<string, CutExchange>  $exchanges
     * @return array<string, CutExchange>
     */
    private function withCall(array $exchanges, RecordedEvent $event, RecordingFakes $fakes): array
    {
        $call = $event->call;

        if ($call === null) {
            return $exchanges;
        }

        $route = array_find(HostRoute::cases(), fn (HostRoute $route) => $route->matchesPath($call->path));
        $body = $call->body === '' ? '{}' : $call->body;
        $processId = explode('/', $call->path)[3] ?? '';

        return match (true) {
            $route === HostRoute::ClaimInstruction && $event->type === RecordedEventType::Answered => $this->withInstructions(
                $exchanges,
                HostClaimedInstructionsPayload::from($body)->instructions,
                $event->at,
                $fakes,
            ),
            $route === HostRoute::NotifyProcessOutput && $event->type === RecordedEventType::Asked => $this->withOutput(
                $exchanges,
                $processId,
                HostOutputPayload::from($body),
                $event->at,
                $fakes,
            ),
            $route === HostRoute::NotifyProcessReport && $event->type === RecordedEventType::Asked => $this->withReport(
                $exchanges,
                HostProcessReportPayload::from($body),
            ),
            default => $exchanges,
        };
    }

    /**
     * @param  array<string, CutExchange>  $exchanges
     * @param  list<HostInstructionPayload>  $instructions
     * @return array<string, CutExchange>
     */
    private function withInstructions(array $exchanges, array $instructions, int $at, RecordingFakes $fakes): array
    {
        $after = $exchanges;

        foreach ($instructions as $instruction) {
            $after = $this->withInstruction($after, $instruction, $at, $fakes);
        }

        return $after;
    }

    /**
     * @param  array<string, CutExchange>  $exchanges
     * @return array<string, CutExchange>
     */
    private function withInstruction(array $exchanges, HostInstructionPayload $instruction, int $at, RecordingFakes $fakes): array
    {
        $type = HostInstructionType::from($instruction->type);
        $payload = $instruction->payload;

        if ($type->isOpening()) {
            $opening = RecordingOpening::ofProcess($instruction->processId, HostOpenPlanPayload::from($payload), $at);

            return [
                ...$exchanges,
                $instruction->processId => new CutExchange($opening, [], null),
            ];
        }

        if (! array_key_exists($instruction->processId, $exchanges)) {
            return $exchanges;
        }

        $event = match ($type) {
            HostInstructionType::WriteKeys => RecordedEvent::typed(
                $at,
                $fakes->replaceIn((string) base64_decode(HostKeyWritePayload::from($payload)->bytes, true)),
            ),
            HostInstructionType::WriteStdin => RecordedEvent::typed(
                $at,
                $fakes->replaceIn((string) base64_decode(HostStdinWritePayload::from($payload)->bytes, true)),
            ),
            HostInstructionType::WritePrivate => RecordedEvent::typedSecret($at),
            HostInstructionType::Resize => $this->resizeOf(HostTerminalSizePayload::from($payload), $at),
            default => null,
        };

        if ($event === null) {
            return $exchanges;
        }

        return [
            ...$exchanges,
            $instruction->processId => $exchanges[$instruction->processId]->withEvent($event),
        ];
    }

    /**
     * @param  array<string, CutExchange>  $exchanges
     * @return array<string, CutExchange>
     */
    private function withOutput(
        array $exchanges,
        string $processId,
        HostOutputPayload $output,
        int $at,
        RecordingFakes $fakes,
    ): array {
        if (! array_key_exists($processId, $exchanges)) {
            return $exchanges;
        }

        $exchange = $exchanges[$processId];

        foreach ($output->chunks as $chunk) {
            $printed = $fakes->replaceIn(HostChunks::printed($chunk));
            $exchange = $exchange->withEvent(RecordedEvent::printed($at, $chunk->stream, $printed));
        }

        return [
            ...$exchanges,
            $processId => $exchange,
        ];
    }

    /**
     * @param  array<string, CutExchange>  $exchanges
     * @return array<string, CutExchange>
     */
    private function withReport(array $exchanges, HostProcessReportPayload $report): array
    {
        if (! array_key_exists($report->processId, $exchanges)) {
            return $exchanges;
        }

        $exchange = $exchanges[$report->processId];

        return [
            ...$exchanges,
            $report->processId => match ($report->report) {
                HostProcessReportType::Exited => $exchange->endedWith($report->exitCode ?? 0),
                HostProcessReportType::Lost => $exchange->endedWith(1),
                HostProcessReportType::Running, HostProcessReportType::Restarted => $exchange,
            },
        ];
    }

    private function resizeOf(HostTerminalSizePayload $size, int $at): RecordedEvent
    {
        return RecordedEvent::resized($at, $size->columns, $size->rows);
    }
}
