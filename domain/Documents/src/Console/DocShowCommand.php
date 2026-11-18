<?php

declare(strict_types=1);

namespace Domain\Documents\Console;

use App\AgentRequests\Contracts\AgentRequestSender;
use Domain\Documents\Console\Concerns\SendsRecordCalls;
use Illuminate\Console\Command;

final class DocShowCommand extends Command
{
    use SendsRecordCalls;

    protected $signature = 'doc:show {number}';

    protected $description = 'Show one document with its whole text';

    public function handle(AgentRequestSender $journal): int
    {
        $reply = $this->sendSigned($journal, '/agent/docs/show', ['number' => (string) $this->argument('number')]);

        if ($reply === null) {
            return self::FAILURE;
        }

        $this->line("doc {$reply['number']}: {$reply['title']}");
        $this->line((string) $reply['abstract']);
        $this->newLine();
        $this->line((string) $reply['body']);

        return self::SUCCESS;
    }
}
