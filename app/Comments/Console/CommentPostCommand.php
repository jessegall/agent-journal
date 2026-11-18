<?php

declare(strict_types=1);

namespace App\Comments\Console;

use App\AgentRequests\Console\Concerns\SendsSignedCalls;
use App\AgentRequests\Contracts\AgentRequestSender;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

final class CommentPostCommand extends Command
{
    use SendsSignedCalls;

    /**
     * The flags that name a place in the text, with the request field each fills.
     */
    private const array PLACE_FLAGS = ['at-revision' => 'version', 'section' => 'section', 'quote' => 'quote', 'start-offset' => 'start_offset', 'end-offset' => 'end_offset'];

    protected $signature = 'comment:post {target : Such as "doc 12"} {--body=} {--submission-key=} {--at-revision=} {--section=} {--lines=} {--quote=} {--start-offset=} {--end-offset=} {--request-key= : Send again under the key a failed attempt printed} {--json}';

    protected $description = 'Comment on a record: on the whole record, or on a section, lines or an exact quote of one revision';

    protected $help = 'Examples: comment:post "note 1" --body "Is this open?" | comment:post "doc 12" --body "Why?" --at-revision 4 --lines 12-16 | --at-revision 4 --section 3 | --at-revision 4 --lines 12-12 --quote "the plan" --start-offset 5 --end-offset 13. A retry must reuse the printed submission key.';

    public function handle(AgentRequestSender $journal): int
    {
        $given = $this->option('submission-key');
        $key = is_string($given) && $given !== '' ? $given : (string) Str::uuid();
        $this->line("Submission key: {$key} (reuse it with --submission-key to retry this comment)");

        return $this->sendWriteAndPrint($journal, '/agent/comments/post', [
            'target' => (string) $this->argument('target'),
            'body' => (string) $this->option('body'),
            'submission_key' => $key,
            ...$this->placeFields(),
        ]);
    }

    /**
     * The fields of the place the flags name; none means a comment on the whole record. The journal refuses a mixed
     * or partial set of flags.
     *
     * @return array<string, string|int>
     */
    private function placeFields(): array
    {
        $fields = [];
        $lines = $this->option('lines');

        if (is_string($lines) && preg_match('/^(\d+)-(\d+)$/', $lines, $span) === 1) {
            $fields['first_line'] = (int) $span[1];
            $fields['last_line'] = (int) $span[2];
        }

        foreach (self::PLACE_FLAGS as $flag => $field) {
            $value = $this->option($flag);

            if (is_string($value) && $value !== '') {
                $fields[$field] = $value;
            }
        }

        return $fields;
    }
}
