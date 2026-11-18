<?php

declare(strict_types=1);

namespace App\Agents\Support;

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
    ) {}

    /**
     * @return array{token: string, folders: list<array<string, mixed>>}
     */
    public function toArray(): array
    {
        return [
            'token' => $this->token,
            'folders' => array_map(fn (LaunchFolder $folder) => $folder->toArray(), $this->folders),
        ];
    }
}
