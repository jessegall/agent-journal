<?php

declare(strict_types=1);

namespace App\Text\Console;

use App\AgentRequests\Console\Concerns\SendsSignedCalls;
use App\AgentRequests\Contracts\AgentRequestSender;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Read)]
final class TextSectionsCommand extends Command
{
    use SendsSignedCalls;

    protected $signature = 'text:sections {target : Such as "doc 12"} {--at-revision=} {--after-section=0} {--per-page=50} {--json}';

    protected $description = 'List the sections of one version of the text of a record; nextAfterSection is the --after-section of the next page';

    protected $help = 'Example: text:sections "doc 12" --at-revision 4 --after-section 0';

    public function handle(AgentRequestSender $journal): int
    {
        $body = [
            'target' => (string) $this->argument('target'),
            'version' => (string) $this->option('at-revision'),
            'after_section' => (int) $this->option('after-section'),
            'per_page' => (int) $this->option('per-page'),
        ];

        return $this->sendAndPrint($journal, '/agent/text/sections', $body);
    }
}
