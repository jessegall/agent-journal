<?php

declare(strict_types=1);

namespace Domain\Documents\Console;

use App\AgentRequests\Contracts\AgentRequestSender;
use Domain\Documents\Console\Concerns\PrintsComments;
use Illuminate\Console\Command;

final class DocCommentsCommand extends Command
{
    use PrintsComments;

    protected $signature = 'doc:comments {number} {--page=1}';

    protected $description = 'List the comments users wrote on a document, oldest first';

    public function handle(AgentRequestSender $journal): int
    {
        return $this->showComments($journal, '/agent/docs/comments');
    }
}
