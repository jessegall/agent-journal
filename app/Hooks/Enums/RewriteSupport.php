<?php

declare(strict_types=1);

namespace App\Hooks\Enums;

use App\Hooks\Decisions\Decision;
use App\Hooks\Programs\ProgramReplies;
use App\Hooks\Programs\ProgramReply;
use App\Hooks\Programs\ProgramToolInput;
use App\Hooks\Stack\AgentStack;
use App\Hooks\Stack\HookAnswer;

/**
 * Whether a program can take a rewritten command without the journal granting a native approval.
 */
enum RewriteSupport: string
{
    case WithoutApproval = 'without_approval';
    case NeedsApproval = 'needs_approval';

    /**
     * Whether the program runs a rewritten command line without asking anyone first.
     */
    public function canRewrite(): bool
    {
        return match ($this) {
            self::WithoutApproval => true,
            self::NeedsApproval => false,
        };
    }

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
            self::WithoutApproval => ProgramReplies::rewriteTool(
                $original->withCommand($answer->decision->replacementLine()),
                $answer->context,
            ),
            self::NeedsApproval => ProgramReplies::denyTool(ProgramReplies::REWRITE_REFUSAL, $answer->context),
        };
    }
}
