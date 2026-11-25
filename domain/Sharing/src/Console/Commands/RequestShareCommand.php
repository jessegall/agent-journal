<?php

declare(strict_types=1);

namespace Domain\Sharing\Console\Commands;

use App\Console\Concerns\RunsApiPipelines;
use Domain\Sharing\Api\RequestSharePayload;
use Illuminate\Console\Command;

/**
 * An agent proposes sharing a record, over a signed call, and prints the proposal's number and state.
 */
final class RequestShareCommand extends Command
{
    use RunsApiPipelines;

    protected $signature = "share:request {alias : The word the record is named by, such as doc} {number : The record's number} {--request-key= : Send again under the key a failed attempt printed} {--json}";

    protected $description = 'Propose sharing a record; the owner approves it';

    public function handle(): int
    {
        return $this->runCall(RequestSharePayload::from([
            'alias' => (string) $this->argument('alias'),
            'number' => (string) $this->argument('number'),
            'requestKey' => $this->requestKey(),
        ]));
    }
}
