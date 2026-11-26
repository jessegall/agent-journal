<?php

declare(strict_types=1);

namespace App\Hosts\Values;

use JsonSerializable;

/**
 * The labels a session's container carries on the agent daemon, so the host finds it again: the installation, the
 * session and the account folder it binds, empty when it binds none. The host reads them as its StartLabels.
 */
final readonly class ContainerLabels implements JsonSerializable
{
    public function __construct(
        public string $installation,
        public string $session,
        public string $account,
    ) {}

    /**
     * @return array{installation: string, session: string, account: string}
     */
    public function jsonSerialize(): array
    {
        return [
            'installation' => $this->installation,
            'session' => $this->session,
            'account' => $this->account,
        ];
    }
}
