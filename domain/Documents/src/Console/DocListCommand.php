<?php

declare(strict_types=1);

namespace Domain\Documents\Console;

use App\AgentRequests\Contracts\AgentRequestSender;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Domain\Documents\Console\Concerns\SendsRecordCalls;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Read)]
final class DocListCommand extends Command
{
    use SendsRecordCalls;

    protected $signature = 'doc:list {--state=active : active, settled or all} {--page=1} {--query= : Only those whose text holds these words} {--revisions : Search past revisions too} {--after= : Continue after this cursor}';

    protected $description = 'List the documents of this journal, newest first';

    protected $help = 'Example: php artisan doc:list --query "retention" ; continue a long list with --after <cursor>';

    public function handle(AgentRequestSender $journal): int
    {
        $reply = $this->sendSigned($journal, '/agent/docs/list', ['attention' => (string) $this->option('state'), 'page' => (int) $this->option('page'), 'query' => $this->option('query'), 'after' => $this->option('after'), 'revisions' => $this->option('revisions') === true]);

        if ($reply === null) {
            return self::FAILURE;
        }

        foreach ($reply['rows'] as $row) {
            $this->line("doc {$row['number']}  {$row['title']}: {$row['abstract']}");

            if (isset($row['snippet'])) {
                $this->line("  {$row['foundIn']}: {$row['snippet']}");
            }
        }

        if (isset($reply['next'])) {
            $this->line("More with --after {$reply['next']}.");
        }

        return self::SUCCESS;
    }
}
