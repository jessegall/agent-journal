<?php

declare(strict_types=1);

namespace App\Recordings;

use App\Hosts\Protocol\HostInstructionType;
use App\Hosts\Protocol\HostRoute;
use App\Hosts\Protocol\Payloads\HostClaimedInstructionsPayload;
use App\Hosts\Protocol\Payloads\HostInventoryPayload;
use App\Hosts\Protocol\Payloads\HostInventoryProcessPayload;
use App\Recordings\Enums\Wire;

/**
 * The processes a scenario opened, by the orders its run claimed: a recording keeps only what crossed for them, so a
 * session of the machine's that ran beside the scenario, which the host restarted at the scenario's start took back,
 * leaves no trace in the host's inventory or in its Docker daemon's calls.
 */
final readonly class ScenarioProcesses
{
    /**
     * The pattern of a container of a process, as the host names it, with the process.
     */
    private const string PROCESS_CONTAINER = '#/containers/journal-process-([^/]+)#';

    /**
     * @param  list<string>  $opened  the ids of the processes the scenario's orders opened
     */
    private function __construct(private array $opened) {}

    /**
     * @param  list<CutExchange>  $exchanges
     */
    public static function openedIn(array $exchanges): self
    {
        $opened = [];

        foreach ($exchanges as $exchange) {
            foreach ($exchange->opening->wire === Wire::Host ? $exchange->events : [] as $event) {
                $call = $event->call;

                if ($call === null || $call->status === null || ! HostRoute::ClaimInstruction->matchesPath($call->path)) {
                    continue;
                }

                foreach (HostClaimedInstructionsPayload::from($call->body)->instructions as $instruction) {
                    if (in_array($instruction->type, self::opening(), true)) {
                        $opened[] = $instruction->processId;
                    }
                }
            }
        }

        return new self(array_values(array_unique($opened)));
    }

    /**
     * The exchange with what crossed for another process taken out: the Docker calls about its container and its
     * place in the host's inventory.
     */
    public function scoped(CutExchange $exchange): CutExchange
    {
        $events = [];

        foreach ($exchange->events as $event) {
            $call = $event->call;

            if ($call !== null && $this->isAboutAnotherProcess($call)) {
                continue;
            }

            $isInventory = $call !== null && $call->status === null && HostRoute::NotifyInventory->matchesPath($call->path);
            $events[] = $isInventory ? $event->withCall($call->withBody($this->inventoryOf($call->body))) : $event;
        }

        return $exchange->withEvents($events);
    }

    private function isAboutAnotherProcess(RecordedCall $call): bool
    {
        return preg_match(self::PROCESS_CONTAINER, $call->path, $process) === 1
            && ! in_array($process[1], $this->opened, true);
    }

    /**
     * The inventory with only the scenario's processes in it.
     */
    private function inventoryOf(string $body): string
    {
        $inventory = HostInventoryPayload::from(json_decode($body, true, flags: JSON_THROW_ON_ERROR));

        $processes = array_values(array_filter(
            $inventory->processes,
            fn (HostInventoryProcessPayload $process) => in_array($process->processId, $this->opened, true),
        ));

        $wire = $inventory->toArray();
        $wire['processes'] = array_map(fn (HostInventoryProcessPayload $process) => $process->toArray(), $processes);
        // The order the host last answered before the scenario began is no part of it; a host that starts afresh names none.
        $wire['answered_through'] = '';

        return (string) json_encode($wire, JSON_UNESCAPED_SLASHES);
    }

    /**
     * The order types that open a process.
     *
     * @return list<string>
     */
    private static function opening(): array
    {
        return [
            HostInstructionType::OpenContainer->value,
            HostInstructionType::OpenProcess->value,
        ];
    }
}
