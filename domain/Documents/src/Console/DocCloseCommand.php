<?php

declare(strict_types=1);

namespace Domain\Documents\Console;

use App\AgentRequests\Contracts\AgentRequestSender;
use Domain\Documents\Console\Concerns\SendsRecordCalls;
use Domain\Documents\Console\Support\DraftTokens;
use Illuminate\Console\Command;

final class DocCloseCommand extends Command
{
    use SendsRecordCalls;

    protected $signature = 'doc:close {number}';

    protected $description = 'Close the open draft of a document; a changed text becomes its next revision';

    public function handle(AgentRequestSender $journal, DraftTokens $drafts): int
    {
        $number = (int) $this->argument('number');
        $held = $drafts->of($number);

        if ($held === null) {
            $this->error("No draft of doc {$number} is open here; open it first with doc:open {$number}.");

            return self::FAILURE;
        }

        $reply = $this->sendSigned($journal, '/agent/docs/close', ['number' => (string) $number, 'token' => $held['token'], 'version' => $held['version']]);

        if ($reply === null) {
            return self::FAILURE;
        }

        $drafts->forget($number);
        $this->info($reply['published'] ? "Closed doc {$number} as revision {$reply['revisionNumber']}." : "Closed doc {$number} with no change; it stays at revision {$reply['revisionNumber']}.");

        return self::SUCCESS;
    }
}
