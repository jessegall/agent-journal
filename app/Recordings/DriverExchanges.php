<?php

declare(strict_types=1);

namespace App\Recordings;

use App\Hosts\HostChunks;
use App\Hosts\Protocol\Data\HostClaimedOrdersData;
use App\Hosts\Protocol\Data\HostKeyWriteData;
use App\Hosts\Protocol\Data\HostOpenPlanData;
use App\Hosts\Protocol\Data\HostOrderData;
use App\Hosts\Protocol\Data\HostOutputData;
use App\Hosts\Protocol\Data\HostProcessReportData;
use App\Hosts\Protocol\Data\HostStdinWriteData;
use App\Hosts\Protocol\Data\HostTerminalSizeData;
use App\Hosts\Protocol\HostOrderType;
use App\Hosts\Protocol\HostProcessReportType;
use App\Hosts\Protocol\HostRoute;
use App\Recordings\Enums\RecordedEventType;

/**
 * Cuts each driver program's exchange out of a run's host exchange: an opening order opens it, the orders to it are
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
     * The exchanges after one host call: a claim's orders, a process's output, or its report.
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
            $route === HostRoute::ClaimOrders && $event->type === RecordedEventType::Answered => $this->withOrders(
                $exchanges,
                HostClaimedOrdersData::from($body)->orders,
                $event->at,
                $fakes,
            ),
            $route === HostRoute::NotifyProcessOutput && $event->type === RecordedEventType::Asked => $this->withOutput(
                $exchanges,
                $processId,
                HostOutputData::from($body),
                $event->at,
                $fakes,
            ),
            $route === HostRoute::NotifyProcessReport && $event->type === RecordedEventType::Asked => $this->withReport(
                $exchanges,
                HostProcessReportData::from($body),
            ),
            default => $exchanges,
        };
    }

    /**
     * @param  array<string, CutExchange>  $exchanges
     * @param  list<HostOrderData>  $orders
     * @return array<string, CutExchange>
     */
    private function withOrders(array $exchanges, array $orders, int $at, RecordingFakes $fakes): array
    {
        $after = $exchanges;

        foreach ($orders as $order) {
            $after = $this->withOrder($after, $order, $at, $fakes);
        }

        return $after;
    }

    /**
     * @param  array<string, CutExchange>  $exchanges
     * @return array<string, CutExchange>
     */
    private function withOrder(array $exchanges, HostOrderData $order, int $at, RecordingFakes $fakes): array
    {
        $type = HostOrderType::from($order->type);
        $payload = $order->payload;

        if ($type->isOpening()) {
            $opening = RecordingOpening::ofProcess($order->processId, HostOpenPlanData::from($payload), $at);

            return [
                ...$exchanges,
                $order->processId => new CutExchange($opening, [], null),
            ];
        }

        if (! array_key_exists($order->processId, $exchanges)) {
            return $exchanges;
        }

        $event = match ($type) {
            HostOrderType::WriteKeys => RecordedEvent::typed(
                $at,
                $fakes->replaceIn((string) base64_decode(HostKeyWriteData::from($payload)->bytes, true)),
            ),
            HostOrderType::WriteStdin => RecordedEvent::typed(
                $at,
                $fakes->replaceIn((string) base64_decode(HostStdinWriteData::from($payload)->bytes, true)),
            ),
            HostOrderType::WritePrivate => RecordedEvent::typedSecret($at),
            HostOrderType::Resize => $this->resizeOf(HostTerminalSizeData::from($payload), $at),
            default => null,
        };

        if ($event === null) {
            return $exchanges;
        }

        return [
            ...$exchanges,
            $order->processId => $exchanges[$order->processId]->withEvent($event),
        ];
    }

    /**
     * @param  array<string, CutExchange>  $exchanges
     * @return array<string, CutExchange>
     */
    private function withOutput(
        array $exchanges,
        string $processId,
        HostOutputData $output,
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
    private function withReport(array $exchanges, HostProcessReportData $report): array
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

    private function resizeOf(HostTerminalSizeData $size, int $at): RecordedEvent
    {
        return RecordedEvent::resized($at, $size->columns, $size->rows);
    }
}
