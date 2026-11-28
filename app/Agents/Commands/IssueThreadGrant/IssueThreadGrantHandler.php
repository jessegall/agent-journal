<?php

declare(strict_types=1);

namespace App\Agents\Commands\IssueThreadGrant;

use App\Agents\Drivers\Work\RuntimeStarts;
use App\Bus\Contracts\CommandHandler;
use App\Models\Agents\AgentRuntime;
use App\Sessions\AgentClientSettings;

final readonly class IssueThreadGrantHandler implements CommandHandler
{
    public function __construct(private RuntimeStarts $headless) {}

    public function handle(IssueThreadGrantCommand $command): AgentClientSettings
    {
        $runtime = AgentRuntime::query()->withSession()->whereKey($command->runtimeId)->lockForUpdate()->sole();

        return $this->headless->clientSettingsOf($runtime);
    }
}
