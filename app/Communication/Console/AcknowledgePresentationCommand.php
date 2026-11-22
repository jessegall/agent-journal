<?php

declare(strict_types=1);

namespace App\Communication\Console;

use App\AgentRequests\Console\Concerns\RunsCallPipelines;
use App\Communication\Calls\AcknowledgePresentationCall;
use Illuminate\Console\Command;

final class AcknowledgePresentationCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'message:acknowledge
        {--batch= : The presentation batch your driver showed}
        {--handle=* : The handle of each piece it showed, once per piece}
        {--context= : The driver context it showed them in: the thread or terminal session}
        {--request-key= : Send again under the key a failed attempt printed}
        {--json}';

    protected $description = 'Confirm the pieces of chat text your driver showed';

    public function handle(): int
    {
        return $this->runCall(AcknowledgePresentationCall::from([
            'batchId' => (string) $this->option('batch'),
            'handles' => array_values(array_map(strval(...), (array) $this->option('handle'))),
            'contextKey' => (string) $this->option('context'),
            'requestKey' => $this->requestKey(),
        ]));
    }
}
