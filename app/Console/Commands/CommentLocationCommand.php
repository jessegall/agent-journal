<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Attributes\JournalRoute;
use App\Calls\Comments\LocateCommentCall;
use App\Console\Concerns\RunsCallPipelines;
use App\Enums\CommandRules\JournalRouteType;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Read)]
final class CommentLocationCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'comment:location {target : Such as "doc 12"} {comment : The comment id} {--lines=} {--json}';

    protected $description = 'Show where a comment points: its record, or the lines of the revision it was left on';

    protected $help = 'Example: comment:location "doc 12" <comment id>; --lines 20-40 reads other lines of that revision, refused for a comment on the whole record';

    public function handle(): int
    {
        $span = $this->lineSpan();

        return $this->runCall(LocateCommentCall::from([
            'target' => (string) $this->argument('target'),
            'comment' => (string) $this->argument('comment'),
            'firstLine' => $span[0] ?? null,
            'lastLine' => $span[1] ?? null,
        ]));
    }
}
