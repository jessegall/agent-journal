<?php

declare(strict_types=1);

namespace App\Comments\Console;

use App\AgentRequests\Console\Concerns\SendsSignedCalls;
use App\AgentRequests\Contracts\AgentRequestSender;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Read)]
final class CommentLocationCommand extends Command
{
    use SendsSignedCalls;

    protected $signature = 'comment:location {target : Such as "doc 12"} {comment : The comment id} {--lines=} {--json}';

    protected $description = 'Show where a comment points: its record, or the lines of the revision it was left on';

    protected $help = 'Example: comment:location "doc 12" <comment id>; --lines 20-40 reads other lines of that revision, refused for a comment on the whole record';

    public function handle(AgentRequestSender $journal): int
    {
        $body = ['target' => (string) $this->argument('target'), 'comment' => (string) $this->argument('comment')];
        $lines = $this->option('lines');

        if (is_string($lines) && preg_match('/^(\d+)-(\d+)$/', $lines, $span) === 1) {
            $body['first_line'] = (int) $span[1];
            $body['last_line'] = (int) $span[2];
        }

        return $this->sendAndPrint($journal, '/agent/comments/location', $body);
    }
}
