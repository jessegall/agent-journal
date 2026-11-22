<?php

declare(strict_types=1);

namespace App\Agents\Enums;

use App\Agents\Support\StartRemedy;

/**
 * Why a host declined a start when no start refusal code names it: the protected account folder it could not verify,
 * or a refusal it gave no reason for.
 */
enum HostRefusal: string
{
    case AccountFolderRejected = 'protected-account-folder-rejected';
    case Unknown = 'unknown';

    public function explanation(): string
    {
        return match ($this) {
            self::AccountFolderRejected => 'The host could not verify the protection required for this account.',
            self::Unknown => 'The host declined this request.',
        };
    }

    public function remedy(): StartRemedy
    {
        return match ($this) {
            self::AccountFolderRejected => StartRemedy::forOperators(
                StartRemedyType::OperatorInstruction,
                'Check account-folder ownership on the host',
            ),
            self::Unknown => StartRemedy::forEveryone(
                StartRemedyType::OperatorInstruction,
                'Give the operator the safe request reference',
            ),
        };
    }
}
