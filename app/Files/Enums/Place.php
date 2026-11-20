<?php

declare(strict_types=1);

namespace App\Files\Enums;

/**
 * A named root folder the file funnel may touch; a private place holds secrets and is named only by its owner.
 */
enum Place: string
{
    case Project = 'project';
    case Accounts = 'accounts';
    case SharingSecrets = 'sharing-secrets';
    case SharingTunnels = 'sharing-tunnels';
    case HostSkills = 'host-skills';
    case Temporary = 'temporary';

    /**
     * The places a path given from outside, such as a command's --file, may lie in.
     *
     * @return list<self>
     */
    public static function notPrivate(): array
    {
        return array_values(array_filter(self::cases(), fn (self $place) => ! $place->isPrivate()));
    }

    public function isPrivate(): bool
    {
        return match ($this) {
            self::Accounts, self::SharingSecrets, self::SharingTunnels => true,
            self::Project, self::HostSkills, self::Temporary => false,
        };
    }

    public function folderMode(): int
    {
        return $this->isPrivate() ? 0o700 : 0o755;
    }

    /**
     * The folders inside this place the funnel never enters, relative to its root: the project's repository,
     * dependencies, agent worktrees and the folder the accounts live in.
     *
     * @return list<string>
     */
    public function closedFolders(): array
    {
        return match ($this) {
            self::Project => ['.journal/worktrees', '.git', 'vendor', 'node_modules', 'storage/app/private'],
            self::Accounts, self::SharingSecrets, self::SharingTunnels, self::HostSkills, self::Temporary => [],
        };
    }

    /**
     * The configuration key that names this place's root folder.
     */
    public function rootSetting(): string
    {
        return match ($this) {
            self::Accounts => 'accounts.root',
            self::SharingSecrets => 'sharing.secrets_dir',
            self::Project, self::SharingTunnels, self::HostSkills, self::Temporary => "files.places.{$this->value}",
        };
    }
}
