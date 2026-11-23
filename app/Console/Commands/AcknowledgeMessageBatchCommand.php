<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Calls\Communication\AcknowledgeMessageBatchCall;
use App\Console\Concerns\RunsCallPipelines;
use Illuminate\Console\Command;

final class AcknowledgeMessageBatchCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'message:acknowledge
        {--batch= : The message batch your driver showed}
        {--handle=* : The handle of each piece it showed, once per piece}
        {--context= : The driver context it showed them in: the thread or terminal session}
        {--request-key= : Send again under the key a failed attempt printed}
        {--json}';

    protected $description = 'Confirm the pieces of chat text your driver showed';

    public function handle(): int
    {
        return $this->runCall(AcknowledgeMessageBatchCall::from([
            'batchId' => (string) $this->option('batch'),
            'handles' => array_values(array_map(strval(...), (array) $this->option('handle'))),
            'contextKey' => (string) $this->option('context'),
            'requestKey' => $this->requestKey(),
        ]));
    }
}
