<?php

declare(strict_types=1);

namespace Tests\Support\Drivers;

use App\Agents\Drivers\Contracts\ProcessDriver;
use App\Hosts\Commands\SendHostKeys\SendHostKeysCommand;
use App\Hosts\Commands\SignalHostProcess\SignalHostProcessCommand;
use App\Models\Hosts\HostOrder;
use App\Models\Hosts\HostProcess;
use App\Support\Command;
use App\Values\ClaimedRequest;
use App\Values\DriverActions;
use App\Values\FeedEntry;
use App\Values\HostOrderSource;
use App\Values\RowGuard;

/**
 * The stand-in program's driver: on output it pastes into the composer as the one step of one request, on a request
 * it signals SIGUSR1 and on an answer SIGUSR2, so a test sees each wake as the order it made.
 */
final readonly class StandInProcessDriver implements ProcessDriver
{
    public const string REQUEST = 'stand-in-request';

    public function __construct(private HostProcess $process, private int $generation) {}

    public function resume(array $inFlight, array $ordered): DriverActions
    {
        return DriverActions::none();
    }

    public function onOutput(FeedEntry $entry): DriverActions
    {
        $paste = HostOrderSource::forStep(self::REQUEST, 'paste', 0, $this->generation);

        return DriverActions::of(new SendHostKeysCommand($this->process->id, 'hello', new RowGuard(0, 0, 'rows'), 0, $paste));
    }

    public function onRequest(ClaimedRequest $request): DriverActions
    {
        return $this->signal('SIGUSR1');
    }

    public function onAnswer(HostOrder $order): DriverActions
    {
        return $this->signal('SIGUSR2');
    }

    public function onAnswered(Command $command, mixed $answer): DriverActions
    {
        return DriverActions::none();
    }

    public function onExit(): DriverActions
    {
        return DriverActions::none();
    }

    private function signal(string $signal): DriverActions
    {
        $source = HostOrderSource::forWorker($this->generation);

        return DriverActions::of(new SignalHostProcessCommand($this->process->id, $signal, $source));
    }
}
