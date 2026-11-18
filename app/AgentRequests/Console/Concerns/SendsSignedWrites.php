<?php

declare(strict_types=1);

namespace App\AgentRequests\Console\Concerns;

use App\AgentRequests\Contracts\AgentRequestSender;
use Illuminate\Support\Str;

/**
 * Sends a write from a console command under its request key, for commands that declare --request-key.
 */
trait SendsSignedWrites
{
    use SendsSignedCalls;

    /**
     * Sends a write under its request key, so a retry with the same --request-key answers from its receipt.
     *
     * @param  array<string, mixed>  $body
     */
    protected function sendWriteAndPrint(AgentRequestSender $journal, string $path, array $body): int
    {
        $given = (string) $this->option('request-key');
        $requestKey = $given !== '' ? $given : (string) Str::ulid();
        $sent = $this->sendAndPrint($journal, $path, [...$body, 'request_key' => $requestKey]);

        if ($sent === self::FAILURE) {
            $this->error("Retry with --request-key={$requestKey} to get this write's answer without making it twice.");
        }

        return $sent;
    }
}
