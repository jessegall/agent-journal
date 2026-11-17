<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Programs;

use App\Domain\Hooks\Stack\HookAnswer;

/**
 * Whether a program can take a rewritten command without the journal granting a native approval.
 */
enum RewriteSupport: string
{
    case WithoutApproval = 'without_approval';
    case NeedsApproval = 'needs_approval';

    public function reply(HookAnswer $answer, NativeToolInput $original): ProgramReply
    {
        return match ($this) {
            self::WithoutApproval => ProgramReplies::rewriteTool($original->withCommand($answer->decision->replacementLine()), $answer->context),
            self::NeedsApproval => ProgramReplies::denyTool(ProgramReplies::REWRITE_REFUSAL, $answer->context),
        };
    }
}
