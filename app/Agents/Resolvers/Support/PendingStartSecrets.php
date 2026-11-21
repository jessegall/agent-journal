<?php

declare(strict_types=1);

namespace App\Agents\Resolvers\Support;

use App\Agents\Exceptions\StartSecretsMissing;
use App\Agents\Support\StartedAgent;
use App\Agents\Support\StartSecrets;
use App\Registries\Support\Registry;

/**
 * Holds the token and settings of the starts accepted in this request until the host reads them; the token is
 * never stored, so a later request cannot read it again.
 */
final class PendingStartSecrets
{
    /**
     * @var Registry<StartSecrets>
     */
    private readonly Registry $secrets;

    public function __construct()
    {
        $this->secrets = Registry::replacing(StartSecretsMissing::forRequest(...));
    }

    public function keep(string $requestId, StartedAgent $started): void
    {
        $this->secrets->put($requestId, $started->secrets());
    }

    public function secrets(string $requestId): StartSecrets
    {
        return $this->secrets->get($requestId);
    }
}
