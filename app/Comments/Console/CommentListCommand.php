<?php

declare(strict_types=1);

namespace App\Comments\Console;

use App\AgentRequests\Console\Concerns\RunsCallPipelines;
use App\Comments\Calls\ListCommentsCall;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Read)]
final class CommentListCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'comment:list {target : Such as "doc 12"} {--after=} {--per-page=50} {--json}';

    protected $description = 'List the comments on a record, oldest first; nextAfter is the --after of the next page';

    protected $help = 'Example: comment:list "doc 12", then comment:list "doc 12" --after <nextAfter>';

    public function handle(): int
    {
        $after = (string) $this->option('after');

        return $this->runCall(ListCommentsCall::from([
            'target' => (string) $this->argument('target'),
            'after' => $after === '' ? null : $after,
            'perPage' => (int) $this->option('per-page'),
        ]));
    }
}
