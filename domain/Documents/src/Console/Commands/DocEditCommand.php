<?php

declare(strict_types=1);

namespace Domain\Documents\Console\Commands;

use App\Attributes\JournalRoute;
use App\Console\Concerns\RunsCallPipelines;
use App\Contracts\Files\Files;
use App\Enums\CommandRules\CommandClass;
use App\Enums\CommandRules\JournalRouteType;
use App\Values\CommandReport;
use Domain\Documents\Calls\DocumentCalls;
use Domain\Documents\Console\Commands\Support\DraftTokens;
use Domain\Documents\Console\Concerns\ReadsRecordBody;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Write, alsoNeeds: [CommandClass::Read])]
final class DocEditCommand extends Command
{
    use ReadsRecordBody;
    use RunsCallPipelines;

    protected $signature = 'doc:edit {number} {--body= : The new text, or - for standard input} {--file= : A local file holding the new text} {--section= : Replace this section, by number or exact heading, with the body} {--replace= : Text to replace} {--with= : Its replacement} {--title=} {--abstract=}';

    protected $description = 'Edit the open draft of a document: the body, one section, one exact piece, or the title and abstract';

    protected $help = 'Example: php artisan doc:edit 4 --section "Risks" --body - < risks.md ; or --replace "old words" --with "new words" ; or --title "New title"';

    public function handle(DocumentCalls $documents, DraftTokens $drafts, Files $files): int
    {
        $number = (int) $this->argument('number');
        $held = $drafts->of($number);

        if ($held === null) {
            $this->error("No draft of doc {$number} is open here; open it first with doc:open {$number}.");

            return self::FAILURE;
        }

        $status = $this->runReport(function () use ($documents, $drafts, $files, $number, $held): CommandReport {
            $draft = $documents->editDocument(
                number: (string) $number,
                token: $held['token'],
                version: $held['version'],
                mode: $this->mode(),
                section: $this->stringOption('section'),
                body: $this->bodyText($files),
                originalText: $this->stringOption('replace'),
                replacementText: $this->stringOption('with'),
                title: $this->stringOption('title'),
                abstract: $this->stringOption('abstract'),
            );

            $drafts->keep($number, $draft->token, $draft->version);
            $report = CommandReport::ending(self::SUCCESS)->line("Saved doc {$number} at version {$draft->version}.");

            foreach ($draft->outline as $section) {
                $report = $report->line("  {$section}");
            }

            return $report;
        });

        if ($status !== self::SUCCESS) {
            $this->line(
                "If the version moved on, read the draft again with doc:show {$number} --draft before editing.",
            );
        }

        return $status;
    }

    private function stringOption(string $name): string|null
    {
        $optionValue = $this->option($name);

        if (is_string($optionValue)) {
            return $optionValue;
        }

        return null;
    }

    /**
     * Which edit the options ask for: one exact piece, the details, one section, or the whole body.
     */
    private function mode(): string
    {
        return match (true) {
            is_string($this->option('replace')) => 'text',
            is_string($this->option('title')), is_string($this->option('abstract')) => 'details',
            is_string($this->option('section')) => 'section',
            default => 'body',
        };
    }
}
