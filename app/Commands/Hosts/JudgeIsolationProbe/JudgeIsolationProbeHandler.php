<?php

declare(strict_types=1);

namespace App\Commands\Hosts\JudgeIsolationProbe;

use App\Agents\Drivers\DefaultDrivers;
use App\Agents\Drivers\Isolation\IsolationProbes;
use App\Commands\Hosts\JudgeHostProtection\JudgeHostProtectionCommand;
use App\Commands\Hosts\OpenHostProcess\OpenHostProcessCommand;
use App\Commands\Hosts\RemoveHostProcess\RemoveHostProcessCommand;
use App\Contracts\Bus\CommandHandler;
use App\Contracts\Bus\JournalCommands;
use App\Enums\Accounts\CommandEntry;
use App\Enums\Drivers\IsolationPlatform;
use App\Enums\Hosts\HostProcessPurpose;
use App\Models\Hosts\HostProcess;
use App\Models\Projects\Host;
use App\Support\Command;
use App\Values\HostOrderSource;
use App\Values\SandboxVerdict;

final readonly class JudgeIsolationProbeHandler implements CommandHandler
{
    private const string TRUSTED_ENTRY = 'host protection';

    public function __construct(private IsolationProbes $probes, private JournalCommands $commands) {}

    public function handle(JudgeIsolationProbeCommand $command): void
    {
        $probe = HostProcess::findLocked($command->processId);
        $hasRun = $probe->exit_code === 0;
        $this->run(new RemoveHostProcessCommand($probe->id));

        if ($hasRun && $probe->purpose === HostProcessPurpose::RelayProbe) {
            $sandbox = $this->probes->sandbox();
            $this->run(new OpenHostProcessCommand($probe->host_id, null, $sandbox, HostOrderSource::fromJournal()));

            return;
        }

        $verdict = $this->verdictOf($probe, $hasRun, $command->printed);
        Host::findLocked($probe->host_id)->recordSandboxVerdict($this->probes->image(), $verdict);
        $family = DefaultDrivers::CLAUDE_CODE;
        $this->run(new JudgeHostProtectionCommand($probe->host_id, $family, IsolationPlatform::Container));
    }

    private function verdictOf(HostProcess $probe, bool $hasRun, string $printed): SandboxVerdict
    {
        if ($hasRun) {
            return SandboxVerdict::runs();
        }

        return SandboxVerdict::refused($this->failureOf($probe, $printed));
    }

    /**
     * Why Claude Code's sandbox cannot run, with the first line the failed probe printed, or why the host lost it.
     */
    private function failureOf(HostProcess $probe, string $printed): string
    {
        $line = strtok($printed, "\n");
        $shown = $line === false || trim($line) === '' ? (string) $probe->exit_evidence : trim($line);

        return match ($probe->purpose) {
            HostProcessPurpose::RelayProbe => "Claude Code's sandbox needs socat, which does not run in the agent image: {$shown}",
            default => "Claude Code's sandbox does not start in the agent container: {$shown}",
        };
    }

    /**
     * @param  Command<mixed>  $command
     */
    private function run(Command $command): void
    {
        $this->commands->runAsJournal(CommandEntry::HostControl, self::TRUSTED_ENTRY, $command);
    }
}
