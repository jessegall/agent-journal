<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Bus\Attributes\Console\JournalRoute;
use App\CommandRules\Enums\JournalRouteType;
use App\Console\Concerns\RunsApiPipelines;
use App\Scripts\Api\ReadProfileLanguagePayload;
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
