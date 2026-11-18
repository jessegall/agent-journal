<?php

declare(strict_types=1);

namespace Domain\Plans\Console;

use App\AgentRequests\Console\Concerns\SendsSignedCalls;
use App\AgentRequests\Contracts\AgentRequestSender;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Illuminate\Console\Command;

/**
 * Records a validated check result on a phase by its result receipt.
 */
#[JournalRoute(JournalRouteType::Write)]
final class PhaseCheckCommand extends Command
{
    use SendsSignedCalls;

    protected $signature = 'phase:check {plan : The plan number} {phase : The phase number}'
        .' {--receipt= : The result receipt of the check} {--json}';

    protected $description = 'Record a validated check result on a phase';

    public function handle(AgentRequestSender $journal): int
    {
        return $this->sendAndPrint($journal, '/agent/plans/phases/check', [
            'plan' => (int) $this->argument('plan'),
            'phase' => (int) $this->argument('phase'),
            'receipt' => (string) $this->option('receipt'),
        ]);
    }
}
