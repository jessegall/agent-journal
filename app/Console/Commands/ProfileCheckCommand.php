<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Api\Scripts\CheckProfileScriptPayload;
use App\Bus\Attributes\Console\JournalRoute;
use App\CommandRules\Enums\JournalRouteType;
use App\Console\Concerns\RunsApiPipelines;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Read)]
final class ProfileCheckCommand extends Command
{
    use RunsApiPipelines;

    protected $signature = 'profile:check {profile} {--source=- : The script text, - for standard input} {--json}';

    protected $description = 'Check script text against the language without saving it';

    public function handle(): int
    {
        $source = (string) $this->option('source');

        return $this->runCall(CheckProfileScriptPayload::from([
            'profile' => (string) $this->argument('profile'),
            'source' => $source === '-' ? (string) stream_get_contents(STDIN) : $source,
        ]));
    }
}
