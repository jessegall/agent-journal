<?php

declare(strict_types=1);

namespace App\Scripts\Console;

use App\AgentRequests\Console\Concerns\RunsCallPipelines;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use App\Scripts\Calls\ReadProfileLanguageCall;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Read)]
final class ProfileLanguageCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'profile:language {--json}';

    protected $description = 'Read the keywords and objects a profile script can use';

    public function handle(): int
    {
        return $this->runCall(ReadProfileLanguageCall::from([]));
    }
}
