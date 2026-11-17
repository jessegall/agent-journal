<?php

declare(strict_types=1);

namespace App\Core\Hooks\Programs;

use App\Core\Hooks\Decisions\AnswerKind;
use App\Core\Hooks\Stack\HookAnswer;

/**
 * The reply shapes Claude Code and Codex share for a pre-tool call and a stop. Shapes only: the walk already decided.
 */
final class ProgramReplies
{
    public const REWRITE_REFUSAL = 'This program cannot take a rewritten command without a native approval. Run the saved command through journal run instead.';

    /**
     * @param  list<string>  $context
     */
    public static function admitTool(array $context): ProgramReply
    {
        return ProgramReply::json(PreToolBody::from(['hookSpecificOutput' => self::withContext([], $context)]));
    }

    /**
     * @param  list<string>  $context
     */
    public static function denyTool(string $reason, array $context): ProgramReply
    {
        return ProgramReply::json(PreToolBody::from(['hookSpecificOutput' => self::withContext([
            'permissionDecision' => NativePermission::Deny,
            'permissionDecisionReason' => $reason,
        ], $context)]));
    }

    /**
     * @param  array<string, mixed>  $updatedInput
     * @param  list<string>  $context
     */
    public static function rewriteTool(array $updatedInput, array $context): ProgramReply
    {
        return ProgramReply::json(PreToolBody::from(['hookSpecificOutput' => self::withContext(['updatedInput' => $updatedInput], $context)]));
    }

    /**
     * The reply to a shell command after the walk and any rewrite check are done.
     */
    public static function shell(HookAnswer $answer, NativeToolInput $original, RewriteSupport $rewrites): ProgramReply
    {
        return match ($answer->decision->answerKind()) {
            AnswerKind::Allow => self::admitTool($answer->context),
            AnswerKind::Deny => self::denyTool($answer->decision->refusalReason(), $answer->context),
            AnswerKind::Rewrite => $rewrites->reply($answer, $original),
            AnswerKind::Delegate, AnswerKind::PreventStop => throw InvalidShellAnswer::forAnswer($answer->decision->answerKind()),
        };
    }

    public static function stop(HookAnswer $answer): ProgramReply
    {
        return match ($answer->decision->answerKind()) {
            AnswerKind::PreventStop => ProgramReply::json(BlockBody::from([
                'decision' => NativeStopDecision::Block,
                'reason' => implode("\n", [$answer->decision->refusalReason(), ...$answer->context]),
            ])),
            AnswerKind::Allow => ProgramReply::emptyObject(),
            AnswerKind::Delegate, AnswerKind::Deny, AnswerKind::Rewrite => throw InvalidStopAnswer::forAnswer($answer->decision->answerKind()),
        };
    }

    /**
     * The reply to a prompt: a denial blocks the prompt with its reason, an allow passes any context on.
     */
    public static function prompt(HookAnswer $answer): ProgramReply
    {
        return match ($answer->decision->answerKind()) {
            AnswerKind::Deny => ProgramReply::json(BlockBody::from([
                'decision' => NativeStopDecision::Block,
                'reason' => $answer->decision->refusalReason(),
            ])),
            AnswerKind::Allow => self::observation('UserPromptSubmit', $answer),
            AnswerKind::Delegate, AnswerKind::PreventStop, AnswerKind::Rewrite => throw InvalidObservationAnswer::forAnswer($answer->decision->answerKind()),
        };
    }

    /**
     * The reply to a hook that only reports: an empty object, or the context for the agent to read.
     */
    public static function observation(string $hookEventName, HookAnswer $answer): ProgramReply
    {
        if ($answer->decision->answerKind() !== AnswerKind::Allow) {
            throw InvalidObservationAnswer::forAnswer($answer->decision->answerKind());
        }

        if ($answer->context === []) {
            return ProgramReply::emptyObject();
        }

        return ProgramReply::json(ContextBody::from(['hookSpecificOutput' => [
            'hookEventName' => $hookEventName,
            'additionalContext' => implode("\n", $answer->context),
        ]]));
    }

    /**
     * @param  array<string, mixed>  $fields
     * @param  list<string>  $context
     * @return array<string, mixed>
     */
    private static function withContext(array $fields, array $context): array
    {
        if ($context === []) {
            return $fields;
        }

        return [...$fields, 'additionalContext' => implode("\n", $context)];
    }
}
