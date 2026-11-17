<?php

declare(strict_types=1);

namespace App\Core\Agents\Console\Concerns;

use App\Core\Agents\Contracts\AgentRequestSender;
use App\Core\Agents\Exceptions\AgentRequestFailed;

/**
 * Sends a console command's signed call as the agent of the launch and prints the journal's answer, as one JSON line
 * with --json or indented otherwise; a failure prints its message and fails the command.
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
