<?php

declare(strict_types=1);

namespace Domain\Documents\Console;

use App\AgentRequests\Contracts\AgentRequestSender;
use Domain\Documents\Console\Concerns\SendsRecordCalls;
use Illuminate\Console\Command;

final class DocRevisionCommand extends Command
{
    use SendsRecordCalls;

    protected $signature = 'doc:revision {number} {revision}';

    protected $description = 'Show one revision of a document with its whole text';

    public function handle(AgentRequestSender $journal): int
    {
        $reply = $this->sendSigned($journal, '/agent/docs/revision', ['number' => (string) $this->argument('number'), 'revision' => (int) $this->argument('revision')]);

        if ($reply === null) {
            return self::FAILURE;
        }

        $this->line("doc {$reply['documentNumber']}, revision {$reply['number']}".($reply['historical'] ? ' (historical)' : '').": {$reply['title']}");
        $this->line((string) $reply['abstract']);
        $this->newLine();
        $this->line((string) $reply['body']);

        return self::SUCCESS;
    }
}
