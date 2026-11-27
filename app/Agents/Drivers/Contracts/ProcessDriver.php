<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Contracts;

use App\Models\Drivers\DriverRequest;
use App\Models\Hosts\HostInstruction;
use App\Support\Command;
use App\Values\ClaimedRequest;
use App\Values\DriverActions;
use App\Values\FeedEntry;

/**
 * What drives one driver's process for one worker: it reads what the process prints and the answers to its
 * instructions, takes its runtime's requests, and answers each with the commands to run next.
 */
interface ProcessDriver
{
    /**
     * Where the requests a worker before this one had taken stand, rebuilt from the instructions it made that were not
     * refused, so no step is ordered twice.
     *
     * @param  list<DriverRequest>  $inFlight
     * @param  list<HostInstruction>  $ordered
     */
    public function resume(array $inFlight, array $ordered): DriverActions;

    /**
     * What the driver does about one entry the process's feed holds: output it printed, a frame or its exit.
     */
    public function onOutput(FeedEntry $entry): DriverActions;

    /**
     * What the driver does about a request of its runtime the worker took for it.
     */
    public function onRequest(ClaimedRequest $request): DriverActions;

    /**
     * What the driver does once the host answered one of the instructions it made.
     */
    public function onAnswer(HostInstruction $instruction): DriverActions;

    /**
     * What the driver does with the journal's answer to a command it ordered, such as the answer to a raise of
     * navigation that hands it a library entry to replay.
     *
     * @param  Command<mixed>  $command
     */
    public function onAnswered(Command $command, mixed $answer): DriverActions;

    /**
     * What the driver does once the process ended for good.
     */
    public function onExit(): DriverActions;
}
