<?php

declare(strict_types=1);

namespace App\Core\AgentRequests\Actions;

use App\Core\AgentRequests\Contracts\AgentRequestSender;
use App\Core\AgentRequests\Exceptions\AgentRequestFailed;
use App\Core\AgentRequests\Support\AgentClientSettings;
use App\Core\AgentRequests\Support\AgentReply;
use App\Core\AgentRequests\Support\AgentRequestClient;
use Illuminate\Http\Client\ConnectionException;

/**
 * Sends a console client's call with the launch's settings and turns an unreachable journal or a refusal into a
 * named failure.
 */
final readonly class SendAgentRequests implements AgentRequestSender
{
    public function __construct(
        private AgentRequestClient $client,
        private AgentClientSettings $settings,
    ) {}

    public function send(string $path, array $body): AgentReply
    {
        try {
            $response = $this->client->post($this->settings, $path, json_encode((object) $body, JSON_THROW_ON_ERROR));
        } catch (ConnectionException $unreachable) {
            throw AgentRequestFailed::unreachable($this->settings->journalUrl, $unreachable);
        }

        if (! $response->successful()) {
            throw AgentRequestFailed::refused($response->status(), (string) ($response->json('message') ?? $response->reason()));
        }

        return new AgentReply((array) $response->json());
    }
}
