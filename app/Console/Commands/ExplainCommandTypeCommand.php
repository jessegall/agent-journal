<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Attributes\JournalRoute;
use App\Calls\Processes\ProcessCalls;
use App\Data\Processes\ExplainedNodeData;
use App\Enums\CommandRules\JournalRouteType;
use App\Enums\Processes\ShellDialect;
use App\Exceptions\CommandStopped;
use Illuminate\Console\Command;

/**
 * Shows how the journal reads a shell line, as a tree of its parts and redirects, without running or opening anything.
 */
#[JournalRoute(JournalRouteType::Read)]
final class ExplainCommandTypeCommand extends Command
{
    protected $signature = 'command-type:explain {--line= : The shell line to explain} {--dialect=bash : bash, sh or zsh} {--json : Print the answer as JSON}';

    protected $description = 'Explain how a shell line is read, without running it';

    public function handle(ProcessCalls $processes): int
    {
        $dialect = ShellDialect::from((string) $this->option('dialect'));

        try {
            $explanation = $processes->explainCommand((string) $this->option('line'), $dialect);
        } catch (CommandStopped $stopped) {
            foreach ($stopped->consoleLines() as $line) {
                $this->error($line);
            }

            return self::FAILURE;
        }

        if ($this->option('json')) {
            $this->line(json_encode($explanation->toArray(), JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES));

            return self::SUCCESS;
        }

        $where = $explanation->diagnostic === null
            ? ''
            : " at byte {$explanation->diagnosticPosition}: {$explanation->diagnostic}";

        $this->line("Outcome: {$explanation->outcome}{$where}");

        if ($explanation->executableParts === 0) {
            $this->line('No executable parts.');
        }

        $this->table([
            'Node',
            'Type',
            'Parent',
            'Source',
            'Redirects',
        ], array_map(fn (ExplainedNodeData $node) => [
            $node->id,
            $node->type,
            $node->parent ?? '-',
            $node->snippet,
            implode('; ', $node->redirects),
        ], $explanation->nodes));

        foreach ($explanation->held as $part) {
            $request = "request {$part->requestId} ({$part->requestState})";
            $this->line("Node {$part->node} {$part->operation}: {$part->code}, {$request}.");
            $this->line("Next: {$part->next}");
        }

        if ($explanation->notice !== '') {
            $this->line($explanation->notice);
        }

        return self::SUCCESS;
    }
}
