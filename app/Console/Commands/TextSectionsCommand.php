<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Attributes\Console\JournalRoute;
use App\Calls\Text\ListTextSectionsCall;
use App\Console\Concerns\RunsCallPipelines;
use App\Enums\CommandRules\JournalRouteType;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Read)]
final class TextSectionsCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'text:sections {target : Such as "doc 12"} {--at-revision=} {--after-section=0} {--per-page=50} {--json}';

    protected $description = 'List the sections of one version of the text of a record; nextAfterSection is the --after-section of the next page';

    protected $help = 'Example: text:sections "doc 12" --at-revision 4 --after-section 0';

    public function handle(): int
    {
        return $this->runCall(ListTextSectionsCall::from([
            'target' => (string) $this->argument('target'),
            'version' => (string) $this->option('at-revision'),
            'afterSection' => (int) $this->option('after-section'),
            'perPage' => (int) $this->option('per-page'),
        ]));
    }
}
