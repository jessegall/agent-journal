<?php

declare(strict_types=1);

namespace App\Core\Hooks\Programs;

use App\Core\Hooks\Enums\AnswerKind;
use App\Core\Hooks\Enums\ProgramPermission;
use App\Core\Hooks\Enums\ProgramStopDecision;
use App\Core\Hooks\Enums\RewriteSupport;
use App\Core\Hooks\Exceptions\InvalidObservationAnswer;
use App\Core\Hooks\Exceptions\InvalidShellAnswer;
use App\Core\Hooks\Exceptions\InvalidStopAnswer;
use App\Core\Hooks\Stack\HookAnswer;

/**
 * The reply shapes Claude Code and Codex share for a pre-tool call and a stop. Shapes only: the walk already decided.
 */
final class ProgramReplies
{
    public const string REWRITE_REFUSAL = 'This program cannot take a rewritten command without a native approval. Run the saved command through journal run instead.';

    /**
     * @param  list<string>  $context
     */
    public static function allowTool(array $context): ProgramReply
    {
        return ProgramReply::json(PreToolBody::from(['hookSpecificOutput' => self::withContext([], $context)]));
    }

    /**
     * @param  list<string>  $context
     */
    public static function denyTool(string $reason, array $context): ProgramReply
    {
        return ProgramReply::json(PreToolBody::from(['hookSpecificOutput' => self::withContext([
            'permissionDecision' => ProgramPermission::Deny,
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
    public static function shell(HookAnswer $answer, ProgramToolInput $original, RewriteSupport $rewrites): ProgramReply
    {
        $kind = $answer->decision->answerKind();

        return match ($kind) {
            AnswerKind::Allow => self::allowTool($answer->context),
            AnswerKind::Deny => self::denyTool($answer->decision->refusalReason(), $answer->context),
            AnswerKind::Rewrite => $rewrites->reply($answer, $original),
            AnswerKind::Delegate, AnswerKind::PreventStop => throw InvalidShellAnswer::forAnswer($kind->value),
        };
    }

    public static function stop(HookAnswer $answer): ProgramReply
    {
        $kind = $answer->decision->answerKind();

        return match ($kind) {
            AnswerKind::PreventStop => ProgramReply::json(BlockBody::from([
                'decision' => ProgramStopDecision::Block,
                'reason' => implode("\n", [$answer->decision->refusalReason(), ...$answer->context]),
            ])),
            AnswerKind::Allow => ProgramReply::emptyObject(),
            AnswerKind::Delegate, AnswerKind::Deny, AnswerKind::Rewrite => throw InvalidStopAnswer::forAnswer($kind->value),
        };
    }

    /**
     * The reply to a prompt: a denial blocks the prompt with its reason, an allow passes any context on.
     */
    public static function prompt(HookAnswer $answer): ProgramReply
    {
        $kind = $answer->decision->answerKind();

        return match ($kind) {
            AnswerKind::Deny => ProgramReply::json(BlockBody::from([
                'decision' => ProgramStopDecision::Block,
                'reason' => $answer->decision->refusalReason(),
            ])),
            AnswerKind::Allow => self::observation('UserPromptSubmit', $answer),
            AnswerKind::Delegate, AnswerKind::PreventStop, AnswerKind::Rewrite => throw InvalidObservationAnswer::forAnswer($kind->value),
        };
    }

    /**
     * The reply to a hook that only reports: an empty object, or the context for the agent to read.
     */
    public static function observation(string $hookEventName, HookAnswer $answer): ProgramReply
    {
        $kind = $answer->decision->answerKind();

        if ($kind !== AnswerKind::Allow) {
            throw InvalidObservationAnswer::forAnswer($kind->value);
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
