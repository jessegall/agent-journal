<?php

declare(strict_types=1);

namespace Domain\Documents\Console;

use App\AgentRequests\Console\Concerns\RunsCallPipelines;
use App\AgentRequests\Values\CommandReport;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\CommandClass;
use App\Processes\Enums\JournalRouteType;
use Domain\Documents\Calls\DocumentCalls;
use Domain\Documents\Console\Concerns\ReadsRecordBody;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Write, alsoNeeds: [CommandClass::Read])]
final class ReportMakeCommand extends Command
{
    use ReadsRecordBody;
    use RunsCallPipelines;

    protected $signature = 'report:make {title} {--abstract= : One line saying what it is} {--body= : The text,'
        .' or - to read it from standard input} {--file= : A local file holding the text} {--about=* : A'
        .' record it is about, such as "task 12"; up to 50}';

    protected $description = 'File a new report; it is shared with every agent and user of this journal';

    protected $help = 'Example: php artisan report:make "Check of the launcher" --abstract "What the check'
        .' found" --file report.md --about "plan 3"';

    public function handle(DocumentCalls $documents): int
    {
        $body = $this->bodyText();

        if ($body === null) {
            $this->error('Give the text with exactly one of --body <text>, --body - or --file <path>.');

            return self::FAILURE;
        }

        $status = $this->runReport(function () use ($documents, $body): CommandReport {
            $filed = $documents->makeReport(
                title: (string) $this->argument('title'),
                abstract: (string) $this->option('abstract'),
                body: $body,
                about: array_values(array_map(strval(...), (array) $this->option('about'))),
            );

            return CommandReport::ending(self::SUCCESS)->line(
                "Filed as {$filed->label}. Reports are shared with every agent and user of this journal;"
                .' linked private records stay private.',
            );
        });

        if ($status !== self::SUCCESS) {
            $this->line('The outcome is uncertain: run report:list to see whether it was filed.');
        }

        return $status;
    }
}
