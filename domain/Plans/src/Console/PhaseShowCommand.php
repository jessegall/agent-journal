<?php

declare(strict_types=1);

namespace Domain\Plans\Console;

use App\AgentRequests\Console\Concerns\SendsSignedCalls;
use App\AgentRequests\Contracts\AgentRequestSender;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Illuminate\Console\Command;

/**
 * Shows a phase with the check results it relies on.
 */
#[JournalRoute(JournalRouteType::Read)]
final class PhaseShowCommand extends Command
{
    use SendsSignedCalls;

    protected $signature = 'phase:show {plan : The plan number} {phase : The phase number} {--json}';

    protected $description = 'Show a phase and its recorded check results';

    public function handle(AgentRequestSender $journal): int
    {
        return $this->sendAndPrint($journal, '/agent/plans/phases/checks', [
            'plan' => (int) $this->argument('plan'),
            'phase' => (int) $this->argument('phase'),
        ]);
    }
}
