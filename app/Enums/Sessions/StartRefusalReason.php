<?php

declare(strict_types=1);

namespace App\Enums\Sessions;

use App\Support\StartRemedy;

/**
 * Why a host declined a start when no start refusal code names it: the protected account folder it could not verify,
 * or a refusal it gave no reason for.
 */
enum StartRefusalReason: string
{
    case AccountFolderRejected = 'protected-account-folder-rejected';
    case IdentityMismatch = 'identity-mismatch';
    case PinnedBuildMissing = 'pinned-build-missing';
    case NotSignedIn = 'not-signed-in';
    case ConversationUnknown = 'conversation-unknown';
    case Unknown = 'unknown';

    public function explanation(): string
    {
        return match ($this) {
            self::AccountFolderRejected => 'The host could not verify the protection required for this account.',
            self::IdentityMismatch => 'The driver started a different conversation than this session is bound to, so nothing was sent to it.',
            self::PinnedBuildMissing => 'The host no longer has the build of the driver this session was started on, '
                .'so it started nothing rather than run the session on another build.',
            self::NotSignedIn => 'The account is not signed in by a method the journal accepts, so no turn was started.',
            self::ConversationUnknown => 'The session names no conversation for the driver to continue.',
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
            self::IdentityMismatch, self::ConversationUnknown => StartRemedy::forEveryone(
                StartRemedyType::RetryStart,
                'Start the agent again',
            ),
            self::PinnedBuildMissing => StartRemedy::forOperators(
                StartRemedyType::OperatorInstruction,
                'Restore the pinned build on the host, or end the session and start a new one',
            ),
            self::NotSignedIn => StartRemedy::forOperators(
                StartRemedyType::OperatorInstruction,
                'Sign the account in again',
            ),
            self::Unknown => StartRemedy::forEveryone(
                StartRemedyType::OperatorInstruction,
                'Give the operator the safe request reference',
            ),
        };
    }
}
