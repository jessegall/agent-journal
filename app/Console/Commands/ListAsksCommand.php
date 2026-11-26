<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Api\Supervision\ListAsksPayload;
use App\Attributes\Console\JournalRoute;
use App\Console\Concerns\RunsApiPipelines;
use App\Enums\CommandRules\JournalRouteType;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Read)]
final class ListAsksCommand extends Command
{
    use RunsApiPipelines;

    protected $signature = 'ask:list {--before=} {--json}';

    protected $description = 'List asks you can read';

    public function handle(): int
    {
        return $this->runCall(ListAsksPayload::from(['before' => $this->option('before')]));
    }
}
