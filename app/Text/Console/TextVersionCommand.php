<?php

declare(strict_types=1);

namespace App\Text\Console;

use App\AgentRequests\Console\Concerns\SendsSignedCalls;
use App\AgentRequests\Contracts\AgentRequestSender;
use Illuminate\Console\Command;

final class TextVersionCommand extends Command
{
    use SendsSignedCalls;

    protected $signature = 'text:version {target : Such as "doc 12"} {--at-revision=} {--json}';

    protected $description = 'Show the text of a record version: its id, label and line count';

    protected $help = 'Example: text:version "doc 12", then text:sections "doc 12" --at-revision <id>';

    public function handle(AgentRequestSender $journal): int
    {
        $body = ['target' => (string) $this->argument('target')];
        $version = $this->option('at-revision');

        if (is_string($version) && $version !== '') {
            $body['version'] = $version;
        }

        return $this->sendAndPrint($journal, '/agent/text/version', $body);
    }
}
