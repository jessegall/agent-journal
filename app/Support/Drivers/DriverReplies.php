<?php

declare(strict_types=1);

namespace App\Support\Drivers;

use App\Contracts\Actors\AgentTexts;
use App\Enums\AnswerType;
use App\Enums\DriverPermission;
use App\Enums\DriverStopDecision;
use App\Enums\HookEvent;
use App\Enums\RewriteSupport;
use App\Exceptions\InvalidObservationAnswer;
use App\Exceptions\InvalidShellAnswer;
use App\Exceptions\InvalidStopAnswer;
use App\Support\Inputs\Values\DriverToolInput;
use App\Support\Stack\HookAnswer;
use App\Values\AgentText;

/**
 * The reply shapes Claude Code and Codex share for a pre-tool call and a stop. Shapes only: the walk already decided.
 */
final class DriverReplies
{
    /**
     * The reply to a tool call the journal admitted: the driver runs it without asking a user.
     *
     * @param  list<string>  $context
     */
    public static function allowTool(array $context): DriverReply
    {
        return DriverReply::json(PreToolBody::from(['hookSpecificOutput' => [
            'permissionDecision' => DriverPermission::Allow,
            'additionalContext' => PreToolOutput::contextText($context),
        ]]));
    }

    /**
     * The reply to a tool call nobody judged, as while the journal is away: no decision, so the driver's own
     * permission rules decide it.
     */
    public static function undecidedTool(): DriverReply
    {
        return DriverReply::json(PreToolBody::from(['hookSpecificOutput' => []]));
    }

    /**
     * The refusal of a tool call that reaches a saved account's sign-in, settings or another session's history.
     */
    public static function denyProtected(AgentTexts $texts): DriverReply
    {
        return self::denyTool($texts->render(AgentText::of('core.drivers.protected')), []);
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
            'permissionDecision' => DriverPermission::Allow,
            'additionalContext' => PreToolOutput::contextText($context),
            'updatedInput' => $updatedInput,
        ]]));
    }

    /**
     * The reply to a shell command after the walk and any rewrite check are done.
     */
    public static function shell(
        HookAnswer $answer,
        DriverToolInput $original,
        RewriteSupport $rewrites,
        AgentTexts $texts,
    ): DriverReply {
        $type = $answer->decision->answerType();

        return match ($type) {
            AnswerType::Allow => self::allowTool($answer->shownContext($texts)),
            AnswerType::Deny => self::denyTool(
                $texts->render($answer->decision->refusalReason()),
                $answer->shownContext($texts),
            ),
            AnswerType::Rewrite => self::rewrite($rewrites, $answer, $original, $texts),
            AnswerType::Delegate => throw InvalidShellAnswer::forAnswer($type->value),
        };
    }

    /**
     * A rewrite the driver takes without approval runs the replacement line; one that needs approval is refused.
     */
    private static function rewrite(
        RewriteSupport $rewrites,
        HookAnswer $answer,
        DriverToolInput $original,
        AgentTexts $texts,
    ): DriverReply {
        return match ($rewrites) {
            RewriteSupport::WithoutApproval => self::rewriteTool(
                $original->withCommand($answer->decision->replacementLine()),
                $answer->shownContext($texts),
            ),
            RewriteSupport::NeedsApproval => self::denyTool(
                $texts->render(AgentText::of('core.drivers.rewrite_refused')),
                $answer->shownContext($texts),
            ),
        };
    }

    public static function stop(HookAnswer $answer, AgentTexts $texts): DriverReply
    {
        $type = $answer->decision->answerType();

        return match ($type) {
            AnswerType::Deny => DriverReply::json(BlockBody::from([
                'decision' => DriverStopDecision::Block,
                'reason' => implode("\n", [
                    $texts->render($answer->decision->refusalReason()),
                    ...$answer->shownContext($texts),
                ]),
            ])),
            AnswerType::Allow => DriverReply::emptyObject(),
            AnswerType::Delegate, AnswerType::Rewrite => throw InvalidStopAnswer::forAnswer($type->value),
        };
    }

    /**
     * The reply to a prompt: a denial blocks the prompt with its reason, an allow passes any context on.
     */
    public static function prompt(HookAnswer $answer, AgentTexts $texts): DriverReply
    {
        $type = $answer->decision->answerType();

        return match ($type) {
            AnswerType::Deny => DriverReply::json(BlockBody::from([
                'decision' => DriverStopDecision::Block,
                'reason' => $texts->render($answer->decision->refusalReason()),
            ])),
            AnswerType::Allow => self::observation(HookEvent::UserPromptSubmit, $answer, $texts),
            AnswerType::Delegate, AnswerType::Rewrite => throw InvalidObservationAnswer::forAnswer($type->value),
        };
    }

    /**
     * The reply to a hook that only reports: the context for the agent to read, or an empty object when there is none
     * or nobody reads on after the event.
     */
    public static function observation(HookEvent $event, HookAnswer $answer, AgentTexts $texts): DriverReply
    {
        $type = $answer->decision->answerType();

        if ($type !== AnswerType::Allow) {
            throw InvalidObservationAnswer::forAnswer($type->value);
        }

        if ($answer->shownContext($texts) === [] || ! $event->hasReaderAfterIt()) {
            return DriverReply::emptyObject();
        }

        return DriverReply::json(ContextBody::from(['hookSpecificOutput' => [
            'hookEventName' => $event->value,
            'additionalContext' => implode("\n", $answer->shownContext($texts)),
        ]]));
    }
}
