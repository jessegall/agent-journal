<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Bus\Attributes\Console\JournalRoute;
use App\CommandRules\Enums\JournalRouteType;
use App\Console\Concerns\RunsApiPipelines;
use App\Scripts\Api\ShowProfileDraftPayload;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Read)]
final class ProfileDraftShowCommand extends Command
{
    use RunsApiPipelines;

    protected $signature = 'profile:draft-show {profile} {--json}';

    protected $description = 'Read a profile\'s shared script draft with what checking it finds';

    public function handle(): int
    {
        return $this->runCall(ShowProfileDraftPayload::from(['profile' => (string) $this->argument('profile')]));
    }
}
