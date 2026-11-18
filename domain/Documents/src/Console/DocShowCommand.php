<?php

declare(strict_types=1);

namespace Domain\Documents\Console;

use App\AgentRequests\Contracts\AgentRequestSender;
use Domain\Documents\Console\Concerns\PrintsRecordText;
use Domain\Documents\Console\Concerns\SendsRecordCalls;
use Domain\Documents\Data\RecordText;
use Illuminate\Console\Command;

final class DocShowCommand extends Command
{
    use PrintsRecordText, SendsRecordCalls;

    protected $signature = 'doc:show {number} {--section= : A section by number or exact heading} {--lines= : A line range, a-b} {--bullets : Only the bullet lines} {--grep= : Only the lines holding these words} {--all : The whole text, past the usual bound} {--revision= : An earlier revision} {--at-revision= : Continue a read begun on this revision} {--draft : Show your own open draft instead of the published text}';

    protected $description = 'Show one document: its outline, or the part of its text you ask for';

    public function handle(AgentRequestSender $journal): int
    {
        $number = (string) $this->argument('number');

        if ($this->option('draft') === true) {
            return $this->showDraft($journal, $number);
        }

        $reply = $this->sendSigned($journal, '/agent/docs/show', ['number' => $number, 'revision' => $this->option('revision'), 'at_revision' => $this->option('at-revision'), 'selection' => $this->selection()->toArray()]);

        if ($reply === null) {
            return self::FAILURE;
        }

        $this->printRecordText(RecordText::from($reply), "doc:show {$number}");

        return self::SUCCESS;
    }

    private function showDraft(AgentRequestSender $journal, string $number): int
    {
        $reply = $this->sendSigned($journal, '/agent/docs/draft', ['number' => $number]);

        if ($reply === null) {
            return self::FAILURE;
        }

        $this->line("doc {$reply['documentNumber']}, your draft at version {$reply['version']}: {$reply['title']}");
        $this->line((string) $reply['abstract']);
        $this->newLine();
        $this->line((string) $reply['body']);

        return self::SUCCESS;
    }
}
