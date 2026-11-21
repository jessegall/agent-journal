<?php

declare(strict_types=1);

namespace App\Hooks\Drivers;

use App\Hooks\Enums\AnswerType;
use App\Hooks\Enums\DriverPermission;
use App\Hooks\Enums\DriverStopDecision;
use App\Hooks\Enums\HookEvent;
use App\Hooks\Enums\RewriteSupport;
use App\Hooks\Exceptions\InvalidObservationAnswer;
use App\Hooks\Exceptions\InvalidShellAnswer;
use App\Hooks\Exceptions\InvalidStopAnswer;
use App\Hooks\Inputs\Values\DriverToolInput;
use App\Hooks\Stack\HookAnswer;

/**
 * The reply shapes Claude Code and Codex share for a pre-tool call and a stop. Shapes only: the walk already decided.
 */
final class DriverReplies
{
    public const string PROTECTED_REASON = 'Saved driver accounts, their sign-ins and other sessions\' history '
        .'are private: only this session\'s own saved outputs can be read.';

    public const string REWRITE_REFUSAL = 'This driver cannot take a rewritten command without a native approval. '
        .'Run the command through its alias with journal run instead.';

    /**
     * @param  list<string>  $context
     */
    public static function allowTool(array $context): DriverReply
    {
        return DriverReply::json(PreToolBody::from(['hookSpecificOutput' => [
            'additionalContext' => PreToolOutput::contextText($context),
        ]]));
    }

    /**
     * The refusal of a tool call that reaches a saved account's sign-in, settings or another session's history.
     */
    public static function denyProtected(): DriverReply
    {
        return self::denyTool(self::PROTECTED_REASON, []);
    }

    /**
     * @param  list<string>  $context
     */
    public static function denyTool(string $reason, array $context): DriverReply
    {
        return DriverReply::json(PreToolBody::from(['hookSpecificOutput' => [
            'permissionDecision' => DriverPermission::Deny,
            'permissionDecisionReason' => $reason,
            'additionalContext' => PreToolOutput::contextText($context),
        ]]));
    }

    /**
     * @param  array<string, mixed>  $updatedInput
     * @param  list<string>  $context
     */
    public static function rewriteTool(array $updatedInput, array $context): DriverReply
    {
        return DriverReply::json(PreToolBody::from(['hookSpecificOutput' => [
            'additionalContext' => PreToolOutput::contextText($context),
            'updatedInput' => $updatedInput,
        ]]));
    }

    /**
     * The reply to a shell command after the walk and any rewrite check are done.
     */
    public static function shell(HookAnswer $answer, DriverToolInput $original, RewriteSupport $rewrites): DriverReply
    {
        $type = $answer->decision->answerType();

        return match ($type) {
            AnswerType::Allow => self::allowTool($answer->context),
            AnswerType::Deny => self::denyTool($answer->decision->refusalReason(), $answer->context),
            AnswerType::Rewrite => self::rewrite($rewrites, $answer, $original),
            AnswerType::Delegate => throw InvalidShellAnswer::forAnswer($type->value),
        };
    }

    /**
     * A rewrite the program takes without approval runs the replacement line; one that needs approval is refused.
     */
    private static function rewrite(RewriteSupport $rewrites, HookAnswer $answer, DriverToolInput $original): DriverReply
    {
        return match ($rewrites) {
            RewriteSupport::WithoutApproval => self::rewriteTool(
                $original->withCommand($answer->decision->replacementLine()),
                $answer->context,
            ),
            RewriteSupport::NeedsApproval => self::denyTool(self::REWRITE_REFUSAL, $answer->context),
        };
    }

    public static function stop(HookAnswer $answer): DriverReply
    {
        $type = $answer->decision->answerType();

        return match ($type) {
            AnswerType::Deny => DriverReply::json(BlockBody::from([
                'decision' => DriverStopDecision::Block,
                'reason' => implode("\n", [$answer->decision->refusalReason(), ...$answer->context]),
            ])),
            AnswerType::Allow => DriverReply::emptyObject(),
            AnswerType::Delegate, AnswerType::Rewrite => throw InvalidStopAnswer::forAnswer($type->value),
        };
    }

    /**
     * The reply to a prompt: a denial blocks the prompt with its reason, an allow passes any context on.
     */
    public static function prompt(HookAnswer $answer): DriverReply
    {
        $type = $answer->decision->answerType();

        return match ($type) {
            AnswerType::Deny => DriverReply::json(BlockBody::from([
                'decision' => DriverStopDecision::Block,
                'reason' => $answer->decision->refusalReason(),
            ])),
            AnswerType::Allow => self::observation(HookEvent::UserPromptSubmit, $answer),
            AnswerType::Delegate, AnswerType::Rewrite => throw InvalidObservationAnswer::forAnswer($type->value),
        };
    }

    /**
     * The reply to a hook that only reports: an empty object, or the context for the agent to read.
     */
    public static function observation(HookEvent $event, HookAnswer $answer): DriverReply
    {
        $type = $answer->decision->answerType();

        if ($type !== AnswerType::Allow) {
            throw InvalidObservationAnswer::forAnswer($type->value);
        }

        if ($answer->context === []) {
            return DriverReply::emptyObject();
        }

        return DriverReply::json(ContextBody::from(['hookSpecificOutput' => [
            'hookEventName' => $event->value,
            'additionalContext' => implode("\n", $answer->context),
        ]]));
    }
}
