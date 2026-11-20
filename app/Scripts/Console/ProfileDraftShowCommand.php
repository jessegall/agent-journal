<?php

declare(strict_types=1);

namespace App\Scripts\Console;

use App\AgentRequests\Console\Concerns\RunsCallPipelines;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use App\Scripts\Calls\ShowProfileDraftCall;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Read)]
final class ProfileDraftShowCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'profile:draft-show {profile} {--json}';

    protected $description = 'Read a profile\'s shared script draft with what checking it finds';

    public function handle(): int
    {
        return $this->runCall(ShowProfileDraftCall::from(['profile' => (string) $this->argument('profile')]));
    }
}
