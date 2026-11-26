<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Processes;

use App\Agents\Commands\CheckDriverBuild\CheckDriverBuildCommand;
use App\Agents\Commands\CheckSignIn\CheckSignInCommand;
use App\Agents\Drivers\Contracts\ProcessDriver;
use App\Hosts\Commands\JudgeIsolationProbe\JudgeIsolationProbeCommand;
use App\Hosts\Enums\HostProcessPurpose;
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
        if ($entry->chunk !== null && in_array($entry->chunk->stream, $this->streams(), true)) {
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

    /**
     * The streams a probe's answer is read from: a sign-in line may come on the error stream, as Codex writes it.
     *
     * @return list<string>
     */
    private function streams(): array
    {
        // An isolation probe's failure is the first line it printed on either stream.
        if ($this->process->purpose === HostProcessPurpose::SignInProbe || $this->isIsolationProbe()) {
            return [
                'stdout',
                'stderr',
            ];
        }

        return ['stdout'];
    }

    public function onExit(): DriverActions
    {
        return DriverActions::of(match ($this->process->purpose) {
            HostProcessPurpose::SignInProbe => new CheckSignInCommand($this->process->id, $this->printed),
            HostProcessPurpose::RelayProbe, HostProcessPurpose::SandboxProbe => new JudgeIsolationProbeCommand(
                $this->process->id,
                $this->printed,
            ),
            default => new CheckDriverBuildCommand($this->process->id, $this->printed),
        });
    }

    private function isIsolationProbe(): bool
    {
        return in_array($this->process->purpose, HostProcessPurpose::isolationProbes(), true);
    }
}
