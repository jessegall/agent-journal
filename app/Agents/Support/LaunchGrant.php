<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Enums\OfflineReplyMode;

/**
 * What a host receives once for a Starting runtime: its launch credential and the folders it writes before spawning.
 */
final readonly class LaunchGrant
{
    /**
     * @param  list<LaunchFolder>  $folders
     */
    public function __construct(
        public string $token,
        public array $folders,
        public string|null $profileKey,
        public int|null $profileRevision,
        public OfflineReplyMode $offlineReply,
        public string $offlineReplySeal,
    ) {}

    /**
     * @return array{token: string, folders: list<array<string, mixed>>, profile_key: string|null,
     *     profile_revision: int|null, offline_reply: string, offline_reply_seal: string}
     */
    public function toArray(): array
    {
        return [
            'token' => $this->token,
            'folders' => array_map(fn (LaunchFolder $folder) => $folder->toArray(), $this->folders),
            'profile_key' => $this->profileKey,
            'profile_revision' => $this->profileRevision,
            'offline_reply' => $this->offlineReply->value,
            'offline_reply_seal' => $this->offlineReplySeal,
        ];
    }
}
