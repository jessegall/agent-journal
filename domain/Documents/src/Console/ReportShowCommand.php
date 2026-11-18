<?php

declare(strict_types=1);

namespace Domain\Documents\Console;

use App\AgentRequests\Contracts\AgentRequestSender;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Domain\Documents\Console\Concerns\PrintsRecordText;
use Domain\Documents\Console\Concerns\SendsRecordCalls;
use Domain\Documents\Data\RecordText;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Read)]
final class ReportShowCommand extends Command
{
    use PrintsRecordText, SendsRecordCalls;

    protected $signature = 'report:show {number} {--section= : A section by number or exact heading} {--lines= : A line range, a-b} {--bullets : Only the bullet lines} {--grep= : Only the lines holding these words} {--all : The whole text, past the usual bound}';

    protected $description = 'Show one report: its outline, or the part of its text you ask for';

    protected $help = 'Example: php artisan report:show 7 prints the outline; report:show 7 --section 2 prints a part';

    public function handle(AgentRequestSender $journal): int
    {
        $number = (string) $this->argument('number');
        $reply = $this->sendSigned($journal, '/agent/reports/show', ['number' => $number, 'selection' => $this->selection()->toArray()]);

        if ($reply === null) {
            return self::FAILURE;
        }

        $this->printRecordText(RecordText::from($reply), "report:show {$number}");

        return self::SUCCESS;
    }
}
