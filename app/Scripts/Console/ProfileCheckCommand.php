<?php

declare(strict_types=1);

namespace App\Scripts\Console;

use App\AgentRequests\Console\Concerns\RunsCallPipelines;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use App\Scripts\Calls\CheckProfileScriptCall;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Read)]
final class ProfileCheckCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'profile:check {profile} {--source=- : The script text, - for standard input} {--json}';

    protected $description = 'Check script text against the language without saving it';

    public function handle(): int
    {
        $source = (string) $this->option('source');

        return $this->runCall(CheckProfileScriptCall::from([
            'profile' => (string) $this->argument('profile'),
            'source' => $source === '-' ? (string) stream_get_contents(STDIN) : $source,
        ]));
    }
}
