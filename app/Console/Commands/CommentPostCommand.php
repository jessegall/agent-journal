<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Attributes\JournalRoute;
use App\Calls\Comments\CommentPlace;
use App\Calls\Comments\PostCommentCall;
use App\Console\Concerns\RunsCallPipelines;
use App\Enums\JournalRouteType;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

#[JournalRoute(JournalRouteType::Write)]
final class CommentPostCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'comment:post {target : Such as "doc 12"} {--body=} {--submission-key=} {--at-revision=} {--section=} {--lines=} {--quote=} {--start-offset=} {--end-offset=} {--request-key= : Send again under the key a failed attempt printed} {--json}';

    protected $description = 'Comment on a record: on the whole record, or on a section, lines or an exact quote of one revision';

    protected $help = 'Examples: comment:post "note 1" --body "Is this open?" | comment:post "doc 12" --body "Why?" --at-revision 4 --lines 12-16 | --at-revision 4 --section 3 | --at-revision 4 --lines 12-12 --quote "the plan" --start-offset 5 --end-offset 13. A retry must reuse the printed submission key.';

    public function handle(): int
    {
        $given = (string) $this->option('submission-key');
        $key = $given !== '' ? $given : (string) Str::uuid();
        $this->line("Submission key: {$key} (reuse it with --submission-key to retry this comment)");

        return $this->runCall(PostCommentCall::from([
            'target' => (string) $this->argument('target'),
            'body' => (string) $this->option('body'),
            'submissionKey' => $key,
            'place' => $this->place(),
            'requestKey' => $this->requestKey(),
        ]));
    }

    /**
     * The place the flags name; none means a comment on the whole record. The journal refuses a mixed or partial set
     * of flags.
     */
    private function place(): CommentPlace|null
    {
        $span = $this->lineSpan();

        $fields = array_filter([
            'section' => $this->filledOption('section') === null ? null : (int) $this->option('section'),
            'firstLine' => $span[0] ?? null,
            'lastLine' => $span[1] ?? null,
            'quote' => $this->filledOption('quote'),
            'startOffset' => $this->filledOption('start-offset') === null ? null : (int) $this->option('start-offset'),
            'endOffset' => $this->filledOption('end-offset') === null ? null : (int) $this->option('end-offset'),
        ], fn (int|string|null $commentField): bool => $commentField !== null);

        $version = $this->filledOption('at-revision');

        if ($version === null && $fields === []) {
            return null;
        }

        return CommentPlace::from(['version' => (string) $version, ...$fields]);
    }

    private function filledOption(string $name): string|null
    {
        $commentField = $this->input->getOption($name);

        if (is_string($commentField) && $commentField !== '') {
            return $commentField;
        }

        return null;
    }
}
