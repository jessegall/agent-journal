<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Enums\OfflineReplyMode;

/**
 * What a host receives once for a Starting runtime: its start token, the folders it writes before spawning and, for
 * a contained session, the manifest of the container it runs in.
 */
final readonly class StartGrant
{
    /**
     * @param  list<StartFolder>  $folders
     */
    public function __construct(
        public string $token,
        public array $folders,
        public string|null $profileKey,
        public int|null $profileRevision,
        public OfflineReplyMode $offlineReply,
        public string $offlineReplySeal,
        public RuntimeStart $runtime,
        public ContainerManifest|null $container = null,
    ) {}

    /**
     * @return array{token: string, folders: list<array<string, mixed>>, profile_key: string|null,
     *     profile_revision: int|null, offline_reply: string, offline_reply_seal: string,
     *     runtime: array{driver_type: string, program: string, program_build: string, folder: string,
     *     process_generation: int, model: string|null, effort: string|null}, container: ContainerManifest|null}
     */
    public function toArray(): array
    {
        return [
            'token' => $this->token,
            'folders' => array_map(fn (StartFolder $folder) => $folder->toArray(), $this->folders),
            'profile_key' => $this->profileKey,
            'profile_revision' => $this->profileRevision,
            'offline_reply' => $this->offlineReply->value,
            'offline_reply_seal' => $this->offlineReplySeal,
            'runtime' => $this->runtime->toArray(),
            'container' => $this->container,
        ];
    }
}
