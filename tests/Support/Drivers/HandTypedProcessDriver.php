<?php

declare(strict_types=1);

namespace Tests\Support\Drivers;

use App\Agents\Drivers\Contracts\ProcessDriver;
use App\Models\Hosts\HostInstruction;
use App\Support\Command;
use App\Values\ClaimedRequest;
use App\Values\DriverActions;
use App\Values\FeedEntry;

/**
 * The driver of a process a test types into by hand: its worker reads what the process shows and orders nothing.
 */
final readonly class HandTypedProcessDriver implements ProcessDriver
{
    public function resume(array $inFlight, array $ordered): DriverActions
    {
        return DriverActions::none();
    }

    public function onOutput(FeedEntry $entry): DriverActions
    {
        return DriverActions::none();
    }

    public function onRequest(ClaimedRequest $request): DriverActions
    {
        return DriverActions::none();
    }

    public function onAnswer(HostInstruction $instruction): DriverActions
    {
        return DriverActions::none();
    }

    public function onAnswered(Command $command, mixed $answer): DriverActions
    {
        return DriverActions::none();
    }

    public function onExit(): DriverActions
    {
        return DriverActions::none();
    }
}
