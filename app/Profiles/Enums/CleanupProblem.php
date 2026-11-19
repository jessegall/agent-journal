<?php

declare(strict_types=1);

namespace App\Profiles\Enums;

/**
 * Why a cleanup has not finished, in words safe to show: the program could not confirm its sign-in is gone, or the
 * folder could not be deleted. The program's own output is never kept.
 */
enum CleanupProblem: string
{
    case SignInNotVerified = 'sign_in_not_verified';
    case FolderNotDeleted = 'folder_not_deleted';

    public static function of(bool $isStoreRemoved): self
    {
        return $isStoreRemoved ? self::FolderNotDeleted : self::SignInNotVerified;
    }
}
