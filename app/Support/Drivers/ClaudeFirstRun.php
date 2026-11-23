<?php

declare(strict_types=1);

namespace App\Support\Drivers;

use App\Attributes\DecodesAnyJson;
use App\Contracts\Files\Files;
use App\Enums\Permissions;
use App\Support\ContainerManifest;
use App\Values\FilePath;
use stdClass;

/**
 * Claude Code's first run in an account folder: its welcome screens and the question whether to trust the folder a
 * session works in. Claude Code keeps the answers in the folder's own state file, which no setting replaces, so they
 * are written there once.
 */
final readonly class ClaudeFirstRun
{
    private const string STATE_FILE = '.claude.json';

    private const string WELCOME_PASSED = 'hasCompletedOnboarding';

    private const string FOLDERS = 'projects';

    private const string FOLDER_TRUSTED = 'hasTrustDialogAccepted';

    public function __construct(private Files $files) {}

    /**
     * Settles the first run in the account folder its owner hands over. The state file is Claude Code's own, with
     * fields the journal does not know: it is read as objects, so every field and every empty object of it stays as
     * it was, and written only when an answer is missing, so a running session's own writes are not raced for nothing.
     */
    #[DecodesAnyJson]
    public function settle(FilePath $accountFolder): void
    {
        $file = $accountFolder->child(self::STATE_FILE);
        $state = $this->files->exists($file) ? json_decode($this->files->read($file), flags: JSON_THROW_ON_ERROR) : new stdClass();
        $folders = $state->{self::FOLDERS} ?? new stdClass();
        $sessionFolder = $folders->{ContainerManifest::WORKDIR} ?? new stdClass();
        $isWelcomePassed = ($state->{self::WELCOME_PASSED} ?? false) === true;
        $isFolderTrusted = ($sessionFolder->{self::FOLDER_TRUSTED} ?? false) === true;

        if ($isWelcomePassed && $isFolderTrusted) {
            return;
        }

        $sessionFolder->{self::FOLDER_TRUSTED} = true;
        $folders->{ContainerManifest::WORKDIR} = $sessionFolder;
        $state->{self::FOLDERS} = $folders;
        $state->{self::WELCOME_PASSED} = true;

        $this->files->write($file, json_encode($state, JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES), Permissions::OwnerOnly);
    }
}
