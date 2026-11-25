<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Attributes\Console\JournalRoute;
use App\Calls\Scripts\CheckProfileScriptCall;
use App\Console\Concerns\RunsCallPipelines;
use App\Enums\CommandRules\JournalRouteType;
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
