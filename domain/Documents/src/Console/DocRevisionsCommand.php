<?php

declare(strict_types=1);

namespace Domain\Documents\Console;

use App\AgentRequests\Contracts\AgentRequestSender;
use Domain\Documents\Console\Concerns\SendsRecordCalls;
use Illuminate\Console\Command;

final class DocRevisionsCommand extends Command
{
    use SendsRecordCalls;

    protected $signature = 'doc:revisions {number} {--page=1}';

    protected $description = 'List the revisions of a document';

    protected $help = 'Example: php artisan doc:revisions 4';

    public function handle(AgentRequestSender $journal): int
    {
        $reply = $this->sendSigned($journal, '/agent/docs/revisions', ['number' => (string) $this->argument('number'), 'page' => (int) $this->option('page')]);

        if ($reply === null) {
            return self::FAILURE;
        }

        foreach ($reply['revisions'] as $revision) {
            $this->line("revision {$revision['number']}  {$revision['title']}  by {$revision['authorType']} {$revision['authorId']}  {$revision['closedAt']}");
        }

        return self::SUCCESS;
    }
}
