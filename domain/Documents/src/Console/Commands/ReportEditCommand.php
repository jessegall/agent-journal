<?php

declare(strict_types=1);

namespace Domain\Documents\Console\Commands;

use App\Bus\Attributes\Console\JournalRoute;
use App\CommandRules\Enums\CommandClass;
use App\CommandRules\Enums\JournalRouteType;
use App\Console\Concerns\RunsApiPipelines;
use App\Values\CommandReport;
use Domain\Documents\Api\DocumentApi;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Write, alsoNeeds: [CommandClass::Read])]
final class ReportEditCommand extends Command
{
    use RunsApiPipelines;

    protected $signature = 'report:edit {number}';

    protected $description = 'Reports never change; this explains how to correct one';

    protected $help = 'A report never changes. To correct one, file a new report with report:make and link it to the old one with --about "report 7".';

    public function handle(DocumentApi $documents): int
    {
        return $this->runReport(function () use ($documents): CommandReport {
            $documents->editReport((string) $this->argument('number'));

            return CommandReport::ending(self::FAILURE);
        });
    }
}
