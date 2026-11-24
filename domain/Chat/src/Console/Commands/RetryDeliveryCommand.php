<?php

declare(strict_types=1);

namespace Domain\Chat\Console\Commands;

use App\Attributes\JournalRoute;
use App\Console\Concerns\RunsCallPipelines;
use App\Enums\JournalRouteType;
use Domain\Chat\Calls\RetryDeliveryCall;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Write)]
final class RetryDeliveryCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'chat:retry-delivery {range : The id of the given-up piece of chat text} {--request-key= : Send again under the key a failed attempt printed} {--json}';

    protected $description = 'Ask again for one given-up piece of chat text; only an operator may';

    protected $help = 'Example: journal chat retry-delivery 01JD8X0G9M3QZ6V4K2RANGE0000 prints accepted';

    public function handle(): int
    {
        return $this->runCall(RetryDeliveryCall::from([
            'range' => (string) $this->argument('range'),
            'requestKey' => $this->requestKey(),
        ]));
    }
}
