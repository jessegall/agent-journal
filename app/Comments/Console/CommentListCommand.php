<?php

declare(strict_types=1);

namespace App\Comments\Console;

use App\AgentRequests\Console\Concerns\SendsSignedCalls;
use App\AgentRequests\Contracts\AgentRequestSender;
use Illuminate\Console\Command;

final class CommentListCommand extends Command
{
    use SendsSignedCalls;

    protected $signature = 'comment:list {target : Such as "doc 12"} {--after=} {--per-page=50} {--json}';

    protected $description = 'List the comments on a record, oldest first; nextAfter is the --after of the next page';

    protected $help = 'Example: comment:list "doc 12", then comment:list "doc 12" --after <nextAfter>';

    public function handle(AgentRequestSender $journal): int
    {
        $body = ['target' => (string) $this->argument('target'), 'per_page' => (int) $this->option('per-page')];
        $after = $this->option('after');

        if (is_string($after) && $after !== '') {
            $body['after'] = $after;
        }

        return $this->sendAndPrint($journal, '/agent/comments/list', $body);
    }
}
