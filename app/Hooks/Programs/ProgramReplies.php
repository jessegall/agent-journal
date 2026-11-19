<?php

declare(strict_types=1);

namespace App\Hooks\Programs;

use App\Hooks\Enums\AnswerType;
use App\Hooks\Enums\HookEvent;
use App\Hooks\Enums\ProgramPermission;
use App\Hooks\Enums\ProgramStopDecision;
use App\Hooks\Enums\RewriteSupport;
use App\Hooks\Exceptions\InvalidObservationAnswer;
use App\Hooks\Exceptions\InvalidShellAnswer;
use App\Hooks\Exceptions\InvalidStopAnswer;
use App\Hooks\Inputs\ProgramToolInput;
use App\Hooks\Stack\HookAnswer;

/**
 * The reply shapes Claude Code and Codex share for a pre-tool call and a stop. Shapes only: the walk already decided.
 */
final class ProgramReplies
{
    public const string REWRITE_REFUSAL = 'This program cannot take a rewritten command without a native approval. Run the command through its alias with journal run instead.';

    /**
     * @param  list<string>  $context
     */
    public static function allowTool(array $context): ProgramReply
    {
        return ProgramReply::json(PreToolBody::from(['hookSpecificOutput' => [
            'additionalContext' => PreToolOutput::contextText($context),
        ]]));
    }

    /**
     * @param  list<string>  $context
     */
    public static function denyTool(string $reason, array $context): ProgramReply
    {
        return ProgramReply::json(PreToolBody::from(['hookSpecificOutput' => [
            'permissionDecision' => ProgramPermission::Deny,
            'permissionDecisionReason' => $reason,
            'additionalContext' => PreToolOutput::contextText($context),
        ]]));
    }

    /**
     * @param  array<string, mixed>  $updatedInput
     * @param  list<string>  $context
     */
    public static function rewriteTool(array $updatedInput, array $context): ProgramReply
    {
        return ProgramReply::json(PreToolBody::from(['hookSpecificOutput' => [
            'additionalContext' => PreToolOutput::contextText($context),
            'updatedInput' => $updatedInput,
        ]]));
    }

    /**
     * The reply to a shell command after the walk and any rewrite check are done.
     */
    public static function shell(HookAnswer $answer, ProgramToolInput $original, RewriteSupport $rewrites): ProgramReply
    {
        $type = $answer->decision->answerType();

        return match ($type) {
            AnswerType::Allow => self::allowTool($answer->context),
            AnswerType::Deny => self::denyTool($answer->decision->refusalReason(), $answer->context),
            AnswerType::Rewrite => $rewrites->reply($answer, $original),
            AnswerType::Delegate => throw InvalidShellAnswer::forAnswer($type->value),
        };
    }

    public static function stop(HookAnswer $answer): ProgramReply
    {
        $type = $answer->decision->answerType();

        return match ($type) {
            AnswerType::Deny => ProgramReply::json(BlockBody::from([
                'decision' => ProgramStopDecision::Block,
                'reason' => implode("\n", [$answer->decision->refusalReason(), ...$answer->context]),
            ])),
            AnswerType::Allow => ProgramReply::emptyObject(),
            AnswerType::Delegate, AnswerType::Rewrite => throw InvalidStopAnswer::forAnswer($type->value),
        };
    }

    /**
     * The reply to a prompt: a denial blocks the prompt with its reason, an allow passes any context on.
     */
    public static function prompt(HookAnswer $answer): ProgramReply
    {
        $type = $answer->decision->answerType();

        return match ($type) {
            AnswerType::Deny => ProgramReply::json(BlockBody::from([
                'decision' => ProgramStopDecision::Block,
                'reason' => $answer->decision->refusalReason(),
            ])),
            AnswerType::Allow => self::observation(HookEvent::UserPromptSubmit, $answer),
            AnswerType::Delegate, AnswerType::Rewrite => throw InvalidObservationAnswer::forAnswer($type->value),
        };
    }

    /**
     * The reply to a hook that only reports: an empty object, or the context for the agent to read.
     */
    public static function observation(HookEvent $event, HookAnswer $answer): ProgramReply
    {
        $type = $answer->decision->answerType();

        if ($type !== AnswerType::Allow) {
            throw InvalidObservationAnswer::forAnswer($type->value);
        }

        if ($answer->context === []) {
            return ProgramReply::emptyObject();
        }

        return ProgramReply::json(ContextBody::from(['hookSpecificOutput' => [
            'hookEventName' => $event->value,
            'additionalContext' => implode("\n", $answer->context),
        ]]));
    }
}
