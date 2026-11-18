<?php

declare(strict_types=1);

namespace App\Processes\Console;

use App\AgentRequests\Console\Concerns\SendsSignedCalls;
use App\AgentRequests\Contracts\AgentRequestSender;
use App\AgentRequests\Exceptions\AgentRequestFailed;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Illuminate\Console\Command;

/**
 * Runs a request's approved sample once under its permit, supervised as every run is, then settles the request: on to
 * the proof when the evidence is complete, back to the owner otherwise.
 */
#[JournalRoute(JournalRouteType::Write)]
final class ReaderSampleRunCommand extends Command
{
    use SendsSignedCalls;

    protected $signature = 'reader:sample-run {request : The command request id}'
        .' {--permit= : The evidence permit the owner issued}'
        .' {--request-id= : The id this use of the permit goes under} {--json}';

    protected $description = 'Run the approved evidence sample of a command request once';

    public function handle(AgentRequestSender $journal): int
    {
        $path = "/agent/processes/requests/{$this->argument('request')}/samples";
        try {
            $started = $journal->send($path, [
                'permit' => (string) $this->option('permit'),
                'request_id' => (string) $this->option('request-id'),
            ]);
        } catch (AgentRequestFailed $failure) {
            $this->error($failure->getMessage());

            return self::FAILURE;
        }
        $this->call('process:run', ['--admission' => (string) $started->body['run_id']]);

        return $this->sendAndPrint($journal, "{$path}/settle", []);
    }
}
