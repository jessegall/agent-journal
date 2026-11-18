<?php

declare(strict_types=1);

namespace Domain\Documents\Console\Concerns;

use App\AgentRequests\Contracts\AgentRequestSender;
use App\AgentRequests\Exceptions\AgentRequestFailed;

/**
 * Sends one signed call for a document or report command and prints a plain failure when it does not get through.
 */
trait SendsRecordCalls
{
    /**
     * @param  array<string, mixed>  $fields
     * @return array<string, mixed>|null the reply, or none when the call failed and the failure was printed
     */
    protected function sendSigned(AgentRequestSender $journal, string $path, array $fields): array|null
    {
        try {
            return $journal->send($path, $fields)->body;
        } catch (AgentRequestFailed $failure) {
            $this->error($failure->getMessage());

            return null;
        }
    }
}
