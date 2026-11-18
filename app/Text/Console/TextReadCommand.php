<?php

declare(strict_types=1);

namespace App\Text\Console;

use App\AgentRequests\Console\Concerns\SendsSignedCalls;
use App\AgentRequests\Contracts\AgentRequestSender;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Read)]
final class TextReadCommand extends Command
{
    use SendsSignedCalls;

    protected $signature = 'text:read {target : Such as "doc 12"} {--at-revision=} {--lines=} {--section=} {--json}';

    protected $description = 'Read a bounded part of one version of the text of a record; nextLine is where the next --lines starts';

    protected $help = 'Example: text:read "doc 12" --at-revision 4 --lines 12-30, or --section 3';

    public function handle(AgentRequestSender $journal): int
    {
        $body = ['target' => (string) $this->argument('target'), 'version' => (string) $this->option('at-revision')];
        $lines = $this->option('lines');
        $section = $this->option('section');

        if (is_string($lines) && preg_match('/^(\d+)-(\d*)$/', $lines, $span) === 1) {
            $body['first_line'] = (int) $span[1];

            if ($span[2] !== '') {
                $body['last_line'] = (int) $span[2];
            }
        }

        if (is_string($section) && $section !== '') {
            $body['section'] = $section;
        }

        return $this->sendAndPrint($journal, '/agent/text/read', $body);
    }
}
