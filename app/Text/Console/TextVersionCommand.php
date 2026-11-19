<?php

declare(strict_types=1);

namespace App\Text\Console;

use App\AgentRequests\Console\Concerns\RunsCallPipelines;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use App\Text\Calls\ReadTextVersionCall;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Read)]
final class TextVersionCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'text:version {target : Such as "doc 12"} {--at-revision=} {--json}';

    protected $description = 'Show the text of a record version: its id, label and line count';

    protected $help = 'Example: text:version "doc 12", then text:sections "doc 12" --at-revision <id>';

    public function handle(): int
    {
        $version = (string) $this->option('at-revision');

        return $this->runCall(ReadTextVersionCall::from([
            'target' => (string) $this->argument('target'),
            'version' => $version === '' ? null : $version,
        ]));
    }
}
