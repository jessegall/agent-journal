<?php

declare(strict_types=1);

namespace Domain\Plans\Console\Commands;

use App\Attributes\Console\JournalRoute;
use App\Console\Concerns\RunsApiPipelines;
use App\Enums\CommandRules\JournalRouteType;
use Domain\Plans\Api\ListPhaseChecksPayload;
use Illuminate\Console\Command;

/**
 * Shows a phase with the check results it relies on.
 */
#[JournalRoute(JournalRouteType::Read)]
final class PhaseShowCommand extends Command
{
    use RunsApiPipelines;

    protected $signature = 'phase:show {plan : The plan number} {phase : The phase number} {--json}';

    protected $description = 'Show a phase and its recorded check results';

    public function handle(): int
    {
        return $this->runCall(ListPhaseChecksPayload::from([
            'plan' => (int) $this->argument('plan'),
            'phase' => (int) $this->argument('phase'),
        ]));
    }
}
