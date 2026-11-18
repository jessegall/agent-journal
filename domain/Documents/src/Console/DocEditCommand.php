<?php

declare(strict_types=1);

namespace Domain\Documents\Console;

use App\AgentRequests\Contracts\AgentRequestSender;
use Domain\Documents\Console\Concerns\ReadsRecordBody;
use Domain\Documents\Console\Concerns\SendsRecordCalls;
use Domain\Documents\Console\Support\DraftTokens;
use Illuminate\Console\Command;

final class DocEditCommand extends Command
{
    use ReadsRecordBody, SendsRecordCalls;

    protected $signature = 'doc:edit {number} {--body= : The new text, or - for standard input} {--file= : A local file holding the new text} {--section= : Replace this section, by number or exact heading, with the body} {--replace= : Text to replace} {--with= : Its replacement} {--title=} {--abstract=}';

    protected $description = 'Edit the open draft of a document: the body, one section, one exact piece, or the title and abstract';

    protected $help = 'Example: php artisan doc:edit 4 --section "Risks" --body - < risks.md ; or --replace "old words" --with "new words" ; or --title "New title"';

    public function handle(AgentRequestSender $journal, DraftTokens $drafts): int
    {
        $number = (int) $this->argument('number');
        $held = $drafts->of($number);

        if ($held === null) {
            $this->error("No draft of doc {$number} is open here; open it first with doc:open {$number}.");

            return self::FAILURE;
        }

        $reply = $this->sendSigned($journal, '/agent/docs/edit', ['number' => (string) $number, 'token' => $held['token'], 'version' => $held['version'], 'mode' => $this->mode(), 'section' => $this->option('section'), 'body' => $this->bodyText(), 'old' => $this->option('replace'), 'new' => $this->option('with'), 'title' => $this->option('title'), 'abstract' => $this->option('abstract')]);

        if ($reply === null) {
            $this->line("If the version moved on, read the draft again with doc:show {$number} --draft before editing.");

            return self::FAILURE;
        }

        $drafts->keep($number, (string) $reply['token'], (int) $reply['version']);
        $this->info("Saved doc {$number} at version {$reply['version']}.");

        foreach ($reply['outline'] as $section) {
            $this->line("  {$section}");
        }

        return self::SUCCESS;
    }

    /**
     * Which edit the options ask for: one exact piece, the details, one section, or the whole body.
     */
    private function mode(): string
    {
        return match (true) {
            is_string($this->option('replace')) => 'text',
            is_string($this->option('title')), is_string($this->option('abstract')) => 'details',
            is_string($this->option('section')) => 'section',
            default => 'body',
        };
    }
}
