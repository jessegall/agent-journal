<?php

declare(strict_types=1);

namespace App\AgentRequests\Support;

/**
 * One signed call ready to send, and to send again unchanged on a transport retry: where it goes, its exact body
 * bytes, its call id, issue time and signature.
 */
final readonly class PreparedAgentCall
{
    public function __construct(
        public AgentClientSettings $settings,
        public string $path,
        public string $body,
        public string $callId,
        public int $issuedAt,
        public string $signature,
    ) {}

    public function url(): string
    {
        return $this->settings->journalUrl.$this->path;
    }

    /**
     * The signed headers of the call.
     *
     * @return array<string, string>
     */
    public function headers(): array
    {
        return [
            SignedCall::ID_HEADER => $this->callId,
            SignedCall::ISSUED_AT_HEADER => (string) $this->issuedAt,
            SignedCall::PROTOCOL_HEADER => SignedCall::PROTOCOL,
            SignedCall::SIGNATURE_HEADER => $this->signature,
            SignedCall::PROFILE_HEADER => $this->settings->profile->key,
            SignedCall::PROFILE_REVISION_HEADER => (string) $this->settings->profile->revision,
        ];
    }
}
