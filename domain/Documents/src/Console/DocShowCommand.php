<?php

declare(strict_types=1);

namespace Domain\Documents\Console;

use App\AgentRequests\Contracts\AgentRequestSender;
use Domain\Documents\Console\Concerns\SendsRecordCalls;
use Illuminate\Console\Command;

final class DocShowCommand extends Command
{
    use SendsRecordCalls;

    protected $signature = 'doc:show {number} {--draft : Show your own open draft instead of the published text}';

    protected $description = 'Show one document with its whole text';

    public function handle(AgentRequestSender $journal): int
    {
        $draft = $this->option('draft') === true;
        $reply = $this->sendSigned($journal, $draft ? '/agent/docs/draft' : '/agent/docs/show', ['number' => (string) $this->argument('number')]);

        if ($reply === null) {
            return self::FAILURE;
        }

        $this->line($draft ? "doc {$reply['documentNumber']}, your draft at version {$reply['version']}: {$reply['title']}" : "doc {$reply['number']}: {$reply['title']}");
        $this->line((string) $reply['abstract']);
        $this->newLine();
        $this->line((string) $reply['body']);

        return self::SUCCESS;
    }
}
