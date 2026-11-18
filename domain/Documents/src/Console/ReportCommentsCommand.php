<?php

declare(strict_types=1);

namespace Domain\Documents\Console;

use App\AgentRequests\Contracts\AgentRequestSender;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Domain\Documents\Console\Concerns\PrintsComments;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Read)]
final class ReportCommentsCommand extends Command
{
    use PrintsComments;

    protected $signature = 'report:comments {number} {--after=}';

    protected $description = 'List the comments on a report, oldest first';

    protected $help = 'Example: php artisan report:comments 7';

    public function handle(AgentRequestSender $journal): int
    {
        return $this->showComments($journal, 'report');
    }
}
