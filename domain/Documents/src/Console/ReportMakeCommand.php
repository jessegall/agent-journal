<?php

declare(strict_types=1);

namespace Domain\Documents\Console;

use App\AgentRequests\Contracts\AgentRequestSender;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\CommandClass;
use App\Processes\Enums\JournalRouteType;
use Domain\Documents\Console\Concerns\ReadsRecordBody;
use Domain\Documents\Console\Concerns\SendsRecordCalls;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Write, alsoNeeds: [CommandClass::Read])]
final class ReportMakeCommand extends Command
{
    use ReadsRecordBody, SendsRecordCalls;

    protected $signature = 'report:make {title} {--abstract= : One line saying what it is} {--body= : The text, or - to read it from standard input} {--file= : A local file holding the text} {--about=* : A record it is about, such as "task 12"; up to 50}';

    protected $description = 'File a new report; it is shared with every agent and user of this journal';

    protected $help = 'Example: php artisan report:make "Check of the launcher" --abstract "What the check found" --file report.md --about "plan 3"';

    public function handle(AgentRequestSender $journal): int
    {
        $body = $this->bodyText();

        if ($body === null) {
            $this->error('Give the text with exactly one of --body <text>, --body - or --file <path>.');

            return self::FAILURE;
        }

        $reply = $this->sendSigned($journal, '/agent/reports/make', ['title' => (string) $this->argument('title'), 'abstract' => (string) $this->option('abstract'), 'body' => $body, 'about' => $this->option('about')]);

        if ($reply === null) {
            $this->line('The outcome is uncertain: run report:list to see whether it was filed.');

            return self::FAILURE;
        }

        $this->info("Filed as {$reply['label']}. Reports are shared with every agent and user of this journal; linked private records stay private.");

        return self::SUCCESS;
    }
}
