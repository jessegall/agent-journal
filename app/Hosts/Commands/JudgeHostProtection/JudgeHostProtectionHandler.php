<?php

declare(strict_types=1);

namespace App\Hosts\Commands\JudgeHostProtection;

use App\Agents\Drivers\Contracts\PinnedBuilds;
use App\Agents\Drivers\Isolation\IsolationMechanisms;
use App\Agents\Drivers\Isolation\IsolationProbes;
use App\Bus\Contracts\CommandHandler;
use App\Models\Projects\Host;
use App\Values\ProtectionReport;

final readonly class JudgeHostProtectionHandler implements CommandHandler
{
    public function __construct(
        private IsolationMechanisms $mechanisms,
        private IsolationProbes $probes,
        private PinnedBuilds $builds,
    ) {}

    public function handle(JudgeHostProtectionCommand $command): void
    {
        $host = Host::findLocked($command->hostId);
        $verdict = $host->sandboxVerdictFor($this->probes->image());

        $report = ProtectionReport::judge(
            $command->family,
            $this->builds->versionOf($command->family),
            $command->platform,
            $this->mechanisms->for($command->platform, $command->family, $verdict),
            $host->protectionEvidence(),
        );

        $host->recordProtection($report);
    }
}
