<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\Starts\OfflineReplyMode;
use App\Exceptions\OfflineReplySealInvalid;
use Illuminate\Container\Attributes\Config;

/**
 * The journal's seal over a start's offline reply: it binds the reply to the start token and profile pin with the
 * application key, so settings edited by hand or copied to another start are refused before any neutral reply.
 */
final readonly class OfflineReplySeal
{
    public function __construct(
        #[Config('app.key')]
        private string $key,
    ) {}

    public function seal(string $token, StartProfilePin $profile, OfflineReplyMode $mode): string
    {
        $sealed = implode("\n", [
            $token,
            $profile->key,
            $profile->revision,
            $mode->value,
        ]);

        return hash_hmac('sha256', $sealed, $this->key);
    }

    /**
     * @throws OfflineReplySealInvalid when the seal was not issued for this start, pin and reply
     */
    public function verify(string $token, StartProfilePin $profile, OfflineReplyMode $mode, string $seal): void
    {
        if (! hash_equals($this->seal($token, $profile, $mode), $seal)) {
            throw OfflineReplySealInvalid::forStart();
        }
    }
}
