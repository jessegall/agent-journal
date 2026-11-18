<?php

declare(strict_types=1);

namespace Domain\Documents\Console;

use App\AgentRequests\Contracts\AgentRequestSender;
use Domain\Documents\Console\Concerns\SendsRecordCalls;
use Illuminate\Console\Command;

final class DocListCommand extends Command
{
    use SendsRecordCalls;

    protected $signature = 'doc:list {--state=active : active, settled or all} {--page=1}';

    protected $description = 'List the documents of this journal, newest first';

    public function handle(AgentRequestSender $journal): int
    {
        $reply = $this->sendSigned($journal, '/agent/docs/list', ['attention' => (string) $this->option('state'), 'page' => (int) $this->option('page')]);

        if ($reply === null) {
            return self::FAILURE;
        }

        foreach ($reply['rows'] as $row) {
            $this->line("doc {$row['number']}  {$row['title']}: {$row['abstract']}");
        }

        if ($reply['hasNextPage']) {
            $this->line('More on page '.((int) $reply['page'] + 1).'.');
        }

        return self::SUCCESS;
    }
}
