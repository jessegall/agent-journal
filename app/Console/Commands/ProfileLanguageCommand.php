<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Attributes\JournalRoute;
use App\Calls\Scripts\ReadProfileLanguageCall;
use App\Console\Concerns\RunsCallPipelines;
use App\Enums\CommandRules\JournalRouteType;
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
