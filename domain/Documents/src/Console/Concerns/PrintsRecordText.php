<?php

declare(strict_types=1);

namespace Domain\Documents\Console\Concerns;

use App\AgentRequests\Values\CommandReport;
use App\Text\Support\TextSelection;
use Domain\Documents\Data\RecordText;

/**
 * The read flags doc:show and report:show share, and how a bounded read is printed: the outline when no part is
 * asked for, else the part and the command that reads on.
 */
trait PrintsRecordText
{
    protected function selection(): TextSelection
    {
        $lines = $this->option('lines');
        $range = is_string($lines) && preg_match('/^(\d*)-?(\d*)$/', $lines, $bounds) === 1 ? $bounds : ['', '', ''];

        return TextSelection::from([
            'section' => $this->option('section'),
            'firstLine' => $range[1] === '' ? null : (int) $range[1],
            'lastLine' => $range[2] === '' ? null : (int) $range[2],
            'bullets' => $this->option('bullets') === true,
            'words' => $this->option('grep'),
            'all' => $this->option('all') === true,
        ]);
    }

    protected function recordTextReport(RecordText $read, string $command): CommandReport
    {
        $report = CommandReport::ending(self::SUCCESS)
            ->line("{$read->label}, revision {$read->revision}: {$read->title}")
            ->line($read->abstract)
            ->line('');

        if (! is_string($read->text)) {
            foreach ($read->outline as $section) {
                $report = $report->line("  {$section}");
            }

            return $report->line("Read a section with {$command} --section <number>, or a range with --lines a-b.");
        }

        $report = $report->line($read->text);

        if (is_string($read->continuation) && is_string($read->lines)) {
            $report = $report
                ->line('')
                ->line("Lines {$read->lines} shown; read on with {$command} {$read->continuation}");
        }

        return $report;
    }
}
