<?php

declare(strict_types=1);

namespace Domain\Documents\Console;

use App\AgentRequests\Contracts\AgentRequestSender;
use Domain\Documents\Console\Concerns\PrintsComments;
use Illuminate\Console\Command;

final class ReportCommentsCommand extends Command
{
    use PrintsComments;

    protected $signature = 'report:comments {number} {--page=1}';

    protected $description = 'List the comments users wrote on a report, oldest first';

    protected $help = 'Example: php artisan report:comments 7';

    public function handle(AgentRequestSender $journal): int
    {
        return $this->showComments($journal, '/agent/reports/comments');
    }
}
