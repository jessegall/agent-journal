<?php

declare(strict_types=1);

namespace App\AgentRequests\Console\Concerns;

use App\AgentRequests\Contracts\AgentRequestSender;
use App\AgentRequests\Exceptions\AgentRequestFailed;
use Illuminate\Support\Str;

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

    /**
     * Sends a write under its request key, so a retry with the same --request-key answers from its receipt.
     *
     * @param  array<string, mixed>  $body
     */
    protected function sendWriteAndPrint(AgentRequestSender $journal, string $path, array $body): int
    {
        $requestKey = $this->option('request-key') ?: (string) Str::ulid();
        $sent = $this->sendAndPrint($journal, $path, [...$body, 'request_key' => $requestKey]);

        if ($sent === self::FAILURE) {
            $this->error("Retry with --request-key={$requestKey} to get this write's answer without making it twice.");
        }

        return $sent;
    }
}
