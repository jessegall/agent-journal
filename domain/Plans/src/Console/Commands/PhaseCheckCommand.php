<?php

declare(strict_types=1);

namespace Domain\Plans\Console\Commands;

use App\Attributes\Console\JournalRoute;
use App\Console\Concerns\RunsCallPipelines;
use App\Enums\CommandRules\JournalRouteType;
use Domain\Plans\Calls\RecordPhaseCheckCall;
use Illuminate\Console\Command;

/**
 * Records a validated check result on a phase by its result receipt.
 */
#[JournalRoute(JournalRouteType::Write)]
final class PhaseCheckCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'phase:check {plan : The plan number} {phase : The phase number} {--receipt= : The result receipt of the check} {--request-key= : The key that makes a retry get the same answer} {--json}';

    protected $description = 'Record a validated check result on a phase';

    public function handle(): int
    {
        return $this->runCall(RecordPhaseCheckCall::from([
            'plan' => (int) $this->argument('plan'),
            'phase' => (int) $this->argument('phase'),
            'receipt' => (string) $this->option('receipt'),
            'requestKey' => $this->requestKey(),
        ]));
    }
}
