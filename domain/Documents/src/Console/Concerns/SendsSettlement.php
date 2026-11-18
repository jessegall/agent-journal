<?php

declare(strict_types=1);

namespace Domain\Documents\Console\Concerns;

use App\AgentRequests\Contracts\AgentRequestSender;

/**
 * Sends a settlement with its required reason and says what came of it.
 */
trait SendsSettlement
{
    use SendsRecordCalls;

    /**
     * @param  array<string, mixed>  $fields
     */
    protected function sendSettlement(AgentRequestSender $journal, string $path, array $fields): int
    {
        $reply = $this->sendSigned($journal, $path, ['number' => (string) $this->argument('number'), 'reason' => (string) $this->option('why'), ...$fields]);

        if ($reply === null) {
            return self::FAILURE;
        }

        $this->info("Settled {$this->argument('number')}.");

        return self::SUCCESS;
    }
}
