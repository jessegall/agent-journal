<?php

declare(strict_types=1);

namespace App\AgentRequests\Console\Concerns;

use App\AgentRequests\Contracts\AgentRequestSender;
use App\AgentRequests\Exceptions\AgentRequestFailed;

/**
 * Sends a console command's signed call as the agent of the launch and prints the journal's answer, as one JSON line
 * with --json or indented otherwise; a failure prints its message and fails the command. A write carries a
 * request_key in its signed body: --request-key when given, else a new one, printed on failure so it can be retried.
 */
trait SendsSignedCalls
{
    /**
     * @param  array<string, mixed>  $body
     */
    protected function sendAndPrint(AgentRequestSender $journal, string $path, array $body): int
    {
        try {
            $reply = $journal->send($path, $body);
        } catch (AgentRequestFailed $failure) {
            $this->error($failure->getMessage());

            return self::FAILURE;
        }

        $this->line(json_encode($reply->body, JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES | ($this->option('json') ? 0 : JSON_PRETTY_PRINT)));

        return self::SUCCESS;
    }
}
