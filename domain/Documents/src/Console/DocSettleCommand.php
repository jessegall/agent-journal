<?php

declare(strict_types=1);

namespace Domain\Documents\Console;

use App\AgentRequests\Contracts\AgentRequestSender;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Domain\Documents\Console\Concerns\SendsSettlement;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Write)]
final class DocSettleCommand extends Command
{
    use SendsSettlement;

    protected $signature = 'doc:settle {number} {--why= : Why the document needs no more attention} {--revision= : The revision you read; the current one when left out}';

    protected $description = 'Settle a document as needing no more attention';

    protected $help = 'Example: php artisan doc:settle 4 --why "Shipped in 6.0"; a document with an open draft must be closed first';

    public function handle(AgentRequestSender $journal): int
    {
        $revision = is_string($this->option('revision')) ? $this->option('revision') : $this->currentRevision($journal);

        return $this->sendSettlement($journal, '/agent/docs/settle', ['revision' => $revision]);
    }

    private function currentRevision(AgentRequestSender $journal): string|null
    {
        $read = $this->sendSigned($journal, '/agent/docs/show', ['number' => (string) $this->argument('number')]);

        return is_array($read) ? (string) $read['revision'] : null;
    }
}
