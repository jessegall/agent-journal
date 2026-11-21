<?php

declare(strict_types=1);

namespace Domain\Documents\Console;

use App\Files\Contracts\Files;
use App\AgentRequests\Console\Concerns\RunsCallPipelines;
use App\AgentRequests\Values\CommandReport;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\CommandClass;
use App\Processes\Enums\JournalRouteType;
use Domain\Documents\Calls\DocumentCalls;
use Domain\Documents\Console\Concerns\ReadsRecordBody;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Write, alsoNeeds: [CommandClass::Read])]
final class DocMakeCommand extends Command
{
    use ReadsRecordBody;
    use RunsCallPipelines;

    protected $signature = 'doc:make {title} {--abstract= : One line saying what it is} {--body= : The text, or - to read it from standard input} {--file= : A local file holding the text} {--about=* : A record it is about, such as "task 12"; up to 50}';

    protected $description = 'File a new document; it is shared with every agent and user of this journal';

    protected $help = 'Example: php artisan doc:make "Release plan" --abstract "What ships in 6.0" --file plan.md --about "task 12"';

    public function handle(DocumentCalls $documents, Files $files): int
    {
        $body = $this->bodyText($files);

        if ($body === null) {
            $this->error('Give the text with exactly one of --body <text>, --body - or --file <path>.');

            return self::FAILURE;
        }

        $status = $this->runReport(function () use ($documents, $body): CommandReport {
            $filed = $documents->makeDocument(
                title: (string) $this->argument('title'),
                abstract: (string) $this->option('abstract'),
                body: $body,
                relatedRecords: array_values(array_map(strval(...), (array) $this->option('about'))),
            );

            return CommandReport::ending(self::SUCCESS)->line(
                sprintf(
                    'Filed as %s. Docs are shared with every agent and user of this journal; linked private records stay private.',
                    $filed->label,
                ),
            );
        });

        if ($status !== self::SUCCESS) {
            $this->line('The outcome is uncertain: run doc:list to see whether it was filed.');
        }

        return $status;
    }
}
