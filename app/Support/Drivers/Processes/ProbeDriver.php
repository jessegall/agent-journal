<?php

declare(strict_types=1);

namespace App\Support\Drivers\Processes;

use App\Commands\Agents\CheckDriverBuild\CheckDriverBuildCommand;
use App\Commands\Agents\CheckSignIn\CheckSignInCommand;
use App\Contracts\Drivers\ProcessDriver;
use App\Enums\Hosts\HostProcessPurpose;
use App\Models\Hosts\HostOrder;
use App\Models\Hosts\HostProcess;
use App\Support\Command;
use App\Values\ClaimedRequest;
use App\Values\DriverActions;
use App\Values\FeedEntry;

/**
 * Drives a short process that prints what a start must prove before its first turn, its installed build or its
 * account's sign-in: it keeps what the process prints and, once it ended, has that judged for the start.
 */
final class ProbeDriver implements ProcessDriver
{
    private string $printed = '';

    public function __construct(private readonly HostProcess $process) {}

    public function resume(array $inFlight, array $ordered): DriverActions
    {
        return DriverActions::none();
    }

    public function onOutput(FeedEntry $entry): DriverActions
    {
        if ($entry->chunk?->stream === 'stdout') {
            $this->printed .= $entry->chunk->printed();
        }

        return DriverActions::none();
    }

    public function onRequest(ClaimedRequest $request): DriverActions
    {
        return DriverActions::none();
    }

    public function onAnswer(HostOrder $order): DriverActions
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
        return DriverActions::of(match ($this->process->purpose) {
            HostProcessPurpose::SignInProbe => new CheckSignInCommand($this->process->id, $this->printed),
            default => new CheckDriverBuildCommand($this->process->id, $this->printed),
        });
    }
}
