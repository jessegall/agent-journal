<?php

declare(strict_types=1);

namespace Domain\Documents\Console;

use App\AgentRequests\Contracts\AgentRequestSender;
use Domain\Documents\Console\Concerns\SendsRecordCalls;
use Domain\Documents\Console\Support\DraftTokens;
use Illuminate\Console\Command;

final class DocOpenCommand extends Command
{
    use SendsRecordCalls;

    protected $signature = 'doc:open {number}';

    protected $description = 'Open a draft of a document to edit it';

    public function handle(AgentRequestSender $journal, DraftTokens $drafts): int
    {
        $reply = $this->sendSigned($journal, '/agent/docs/open', ['number' => (string) $this->argument('number')]);

        if ($reply === null) {
            return self::FAILURE;
        }

        $drafts->keep((int) $reply['documentNumber'], (string) $reply['token'], (int) $reply['version']);
        $this->info("doc {$reply['documentNumber']} is open at version {$reply['version']}, from revision {$reply['baseRevisionNumber']}.");

        return self::SUCCESS;
    }
}
