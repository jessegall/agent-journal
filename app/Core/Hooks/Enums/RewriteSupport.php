<?php

declare(strict_types=1);

namespace App\Core\Hooks\Enums;

use App\Core\Hooks\Decisions\Decision;
use App\Core\Hooks\Programs\ProgramReplies;
use App\Core\Hooks\Programs\ProgramReply;
use App\Core\Hooks\Programs\ProgramToolInput;
use App\Core\Hooks\Stack\AgentStack;
use App\Core\Hooks\Stack\HookAnswer;

/**
 * Whether a program can take a rewritten command without the journal granting a native approval.
 */
enum RewriteSupport: string
{
    case WithoutApproval = 'without_approval';
    case NeedsApproval = 'needs_approval';

    /**
     * A rewrite this program cannot take becomes a refusal on the stack from before the walk, so the rewrite's own pushes are dropped.
     */
    public function finalAnswer(HookAnswer $answer, AgentStack $stackBefore): HookAnswer
    {
        if ($this === self::WithoutApproval || ! $answer->isRewrite()) {
            return $answer;
        }

        return $answer->replacedBy(Decision::deny(ProgramReplies::REWRITE_REFUSAL), $stackBefore);
    }

    public function reply(HookAnswer $answer, ProgramToolInput $original): ProgramReply
    {
        return match ($this) {
            self::WithoutApproval => ProgramReplies::rewriteTool($original->withCommand($answer->decision->replacementLine()), $answer->context),
            self::NeedsApproval => ProgramReplies::denyTool(ProgramReplies::REWRITE_REFUSAL, $answer->context),
        };
    }
}
