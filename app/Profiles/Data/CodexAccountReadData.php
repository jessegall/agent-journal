<?php

declare(strict_types=1);

namespace App\Profiles\Data;

use Spatie\LaravelData\Data;

/**
 * Codex's answer to account/read: the account the app-server is signed in with, none when it is signed out.
 */
final class CodexAccountReadData extends Data
{
    public function __construct(public readonly CodexAccountData|null $account = null) {}

    public function isChatGpt(): bool
    {
        return $this->account?->type === 'chatgpt';
    }
}
