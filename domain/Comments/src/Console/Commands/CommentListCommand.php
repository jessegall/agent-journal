<?php

declare(strict_types=1);

namespace Domain\Comments\Console\Commands;

use App\Attributes\Console\JournalRoute;
use App\Console\Concerns\RunsApiPipelines;
use App\Enums\CommandRules\JournalRouteType;
use Domain\Comments\Api\ListCommentsPayload;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Read)]
final class CommentListCommand extends Command
{
    use RunsApiPipelines;

    protected $signature = 'comment:list {target : Such as "doc 12"} {--after=} {--per-page=50} {--json}';

    protected $description = 'List the comments on a record, oldest first; nextAfter is the --after of the next page';

    protected $help = 'Example: comment:list "doc 12", then comment:list "doc 12" --after <nextAfter>';

    public function handle(): int
    {
        $after = (string) $this->option('after');

        return $this->runCall(ListCommentsPayload::from([
            'target' => (string) $this->argument('target'),
            'after' => $after === '' ? null : $after,
            'perPage' => (int) $this->option('per-page'),
        ]));
    }
}
