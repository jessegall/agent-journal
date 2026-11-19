<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\AgentRequests\Support\LaunchProfilePin;
use App\Agents\Enums\OfflineReplyMode;
use App\Agents\Exceptions\OfflineReplySealInvalid;
use Illuminate\Container\Attributes\Config;

/**
 * The journal's seal over a launch's offline reply: it binds the reply to the launch token and profile pin with the
 * application key, so settings edited by hand or copied to another launch are refused before any neutral reply.
 */
final readonly class OfflineReplySeal
{
    public function __construct(
        #[Config('app.key')]
        private string $key,
    ) {}

    public function seal(string $token, LaunchProfilePin $profile, OfflineReplyMode $mode): string
    {
        $sealed = implode("\n", [$token, $profile->key, $profile->revision, $mode->value]);

        return hash_hmac('sha256', $sealed, $this->key);
    }

    /**
     * @throws OfflineReplySealInvalid when the seal was not issued for this launch, pin and reply
     */
    public function verify(string $token, LaunchProfilePin $profile, OfflineReplyMode $mode, string $seal): void
    {
        if (! hash_equals($this->seal($token, $profile, $mode), $seal)) {
            throw OfflineReplySealInvalid::forLaunch();
        }
    }
}
