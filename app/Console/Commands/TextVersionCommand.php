<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Api\Text\ReadTextVersionPayload;
use App\Bus\Attributes\Console\JournalRoute;
use App\CommandRules\Enums\JournalRouteType;
use App\Console\Concerns\RunsApiPipelines;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Read)]
final class TextVersionCommand extends Command
{
    use RunsApiPipelines;

    protected $signature = 'text:version {target : Such as "doc 12"} {--at-revision=} {--json}';

    protected $description = 'Show the text of a record version: its id, label and line count';

    protected $help = 'Example: text:version "doc 12", then text:sections "doc 12" --at-revision <id>';

    public function handle(): int
    {
        $version = (string) $this->option('at-revision');

        return $this->runCall(ReadTextVersionPayload::from([
            'target' => (string) $this->argument('target'),
            'version' => $version === '' ? null : $version,
        ]));
    }
}
