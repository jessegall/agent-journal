<?php

declare(strict_types=1);

namespace App\Processes\Console;

use App\AgentRequests\Contracts\AgentRequestSender;
use App\AgentRequests\Exceptions\AgentRequestFailed;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Data\ExplainedNodeData;
use App\Processes\Data\ExplanationData;
use App\Processes\Enums\JournalRouteType;
use Illuminate\Console\Command;

/**
 * Shows how the journal reads a shell line, as a tree of its parts and redirects, without running or opening anything.
 */
#[JournalRoute(JournalRouteType::Read)]
final class ExplainCommandTypeCommand extends Command
{
    protected $signature = 'command-type:explain {--line= : The shell line to explain} {--dialect=bash : bash, sh or zsh} {--json : Print the answer as JSON}';

    protected $description = 'Explain how a shell line is read, without running it';

    public function handle(AgentRequestSender $journal): int
    {
        try {
            $reply = $journal->send('/agent/processes/explain', ['line' => (string) $this->option('line'), 'dialect' => (string) $this->option('dialect')]);
        } catch (AgentRequestFailed $failure) {
            $this->error($failure->getMessage());

            return self::FAILURE;
        }

        if ($this->option('json')) {
            $this->line(json_encode($reply->body, JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES));

            return self::SUCCESS;
        }

        $explanation = ExplanationData::from($reply->body);
        $this->line("Outcome: {$explanation->outcome}".($explanation->diagnostic === null ? '' : " at byte {$explanation->diagnosticPosition}: {$explanation->diagnostic}"));
        if ($explanation->executableParts === 0) {
            $this->line('No executable parts.');
        }
        $this->table(['Node', 'Type', 'Parent', 'Source', 'Redirects'], array_map(fn (ExplainedNodeData $node) => [$node->id, $node->type, $node->parent ?? '-', $node->snippet, implode('; ', $node->redirects)], $explanation->nodes));

        return self::SUCCESS;
    }
}
