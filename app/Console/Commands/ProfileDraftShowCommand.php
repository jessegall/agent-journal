<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Attributes\JournalRoute;
use App\Calls\Scripts\ShowProfileDraftCall;
use App\Console\Concerns\RunsCallPipelines;
use App\Enums\CommandRules\JournalRouteType;
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
