<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Api\Scripts\ReadProfileLanguagePayload;
use App\Attributes\Console\JournalRoute;
use App\Console\Concerns\RunsApiPipelines;
use App\Enums\CommandRules\JournalRouteType;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Read)]
final class ProfileLanguageCommand extends Command
{
    use RunsApiPipelines;

    protected $signature = 'profile:language {--json}';

    protected $description = 'Read the keywords and objects a profile script can use';

    public function handle(): int
    {
        return $this->runCall(ReadProfileLanguagePayload::from([]));
    }
}
