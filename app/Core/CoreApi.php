<?php

declare(strict_types=1);

namespace App\Core;

use App\Core\Actors\ActorContext;
use App\Core\Actors\ActorKind;
use App\Core\Actors\Exceptions\ActorContextMissing;
use App\Core\Actors\Exceptions\UserActorRequired;
use App\Core\Agents\AgentLabel;
use App\Core\Agents\Contracts\AgentReader;
use App\Core\Agents\Contracts\SessionReader;
use App\Core\Agents\SessionOption;
use App\Core\Contracts\Actor;
use App\Core\Contracts\CurrentActor;
use App\Core\Contracts\EstablishActor;
use App\Core\Hooks\Contracts\AgentStack;
use App\Core\Hooks\Contracts\Answer;
use App\Core\Hooks\Contracts\HookAnswerer;
use App\Core\Hooks\Contracts\HookInput;
use App\Core\Hooks\Contracts\ReminderContribution;
use App\Core\Hooks\Contracts\ShellCommandParser;
use App\Core\Hooks\Contracts\StackEditor;
use App\Core\Hooks\Contracts\StackTransition;
use App\Core\Hooks\Contracts\StackWork;
use App\Core\Hooks\Contracts\StateRegistration;
use App\Core\Hooks\Contracts\StateType;
use App\Core\Hooks\Contracts\UserStack;
use App\Core\Hooks\Decisions\AnswerKind;
use App\Core\Hooks\Decisions\Decision;
use App\Core\Hooks\Decisions\NoSubject;
use App\Core\Hooks\Decisions\StateReference;
use App\Core\Hooks\Decisions\SubjectReference;
use App\Core\Hooks\Decisions\TransitionKind;
use App\Core\Hooks\Events\ContextWasCompacted;
use App\Core\Hooks\Events\StateTypesRequested;
use App\Core\Hooks\Exceptions\StackLockTimedOut;
use App\Core\Hooks\Exceptions\StackTargetRefused;
use App\Core\Hooks\Exceptions\StackTransactionRequired;
use App\Core\Hooks\Exceptions\StateSubjectMissing;
use App\Core\Hooks\Exceptions\StateTypeRepeated;
use App\Core\Hooks\Exceptions\StateTypesFrozen;
use App\Core\Hooks\Inputs\CommandEffect;
use App\Core\Hooks\Inputs\CommandKind;
use App\Core\Hooks\Inputs\CommandPart;
use App\Core\Hooks\Inputs\CompactionDetails;
use App\Core\Hooks\Inputs\ContextCompacted;
use App\Core\Hooks\Inputs\FileChange;
use App\Core\Hooks\Inputs\FileChanges;
use App\Core\Hooks\Inputs\FileEditRequested;
use App\Core\Hooks\Inputs\FileOperation;
use App\Core\Hooks\Inputs\HookIdentity;
use App\Core\Hooks\Inputs\ParseOutcome;
use App\Core\Hooks\Inputs\PartJoin;
use App\Core\Hooks\Inputs\PromptDetails;
use App\Core\Hooks\Inputs\PromptSubmitted;
use App\Core\Hooks\Inputs\SessionEndDetails;
use App\Core\Hooks\Inputs\SessionEnded;
use App\Core\Hooks\Inputs\SessionEndReason;
use App\Core\Hooks\Inputs\SessionStartDetails;
use App\Core\Hooks\Inputs\SessionStarted;
use App\Core\Hooks\Inputs\SessionStartSource;
use App\Core\Hooks\Inputs\ShellCommand;
use App\Core\Hooks\Inputs\ShellCommandRequested;
use App\Core\Hooks\Inputs\ShellDialect;
use App\Core\Hooks\Inputs\StopDetails;
use App\Core\Hooks\Inputs\StopRequested;
use App\Core\Hooks\Inputs\ToolFinished;
use App\Core\Hooks\Inputs\ToolOutcome;
use App\Core\Hooks\Inputs\ToolResult;
use App\Core\Hooks\Models\OwnedByOneAgent;
use App\Core\Hooks\StackTarget;
use App\Core\Hooks\States\AgentState;
use App\Core\Links\Linkable;
use App\Core\Links\LinkAccess;
use App\Core\Links\LinkTypeRenames;
use App\Core\Links\LinkTypes;

/**
 * Core's public surface: every type a domain or module may use, written out one by one. Everything else in Core is
 * private, whatever folder it sits in. Core is not a domain and is never required; domains use it without declaring it.
 * EstablishActor, LinkTypes and LinkTypeRenames are listed for the few places that compose the application (the
 * sign-in middleware, owner providers and migrations), not for ordinary use.
 */
final class CoreApi
{
    /**
     * @return list<class-string>
     */
    public static function exports(): array
    {
        return [
            Actor::class,
            CurrentActor::class,
            EstablishActor::class,
            ActorKind::class,
            ActorContext::class,
            ActorContextMissing::class,
            UserActorRequired::class,
            AgentReader::class,
            AgentLabel::class,
            SessionReader::class,
            SessionOption::class,
            StackTarget::class,
            AgentStack::class,
            UserStack::class,
            StackWork::class,
            AgentState::class,
            StateType::class,
            Decision::class,
            Answer::class,
            AnswerKind::class,
            StackTransition::class,
            TransitionKind::class,
            StackEditor::class,
            StateReference::class,
            NoSubject::class,
            SubjectReference::class,
            ShellCommandParser::class,
            HookAnswerer::class,
            HookInput::class,
            ContextCompacted::class,
            CompactionDetails::class,
            FileEditRequested::class,
            FileChanges::class,
            FileChange::class,
            FileOperation::class,
            HookIdentity::class,
            PromptSubmitted::class,
            PromptDetails::class,
            SessionEnded::class,
            SessionEndDetails::class,
            SessionEndReason::class,
            SessionStarted::class,
            SessionStartDetails::class,
            SessionStartSource::class,
            ShellCommandRequested::class,
            ShellCommand::class,
            CommandPart::class,
            CommandKind::class,
            CommandEffect::class,
            PartJoin::class,
            ShellDialect::class,
            ParseOutcome::class,
            StopRequested::class,
            StopDetails::class,
            ToolFinished::class,
            ToolResult::class,
            ToolOutcome::class,
            ContextWasCompacted::class,
            StateTypesRequested::class,
            StateRegistration::class,
            ReminderContribution::class,
            StateTypeRepeated::class,
            StateTypesFrozen::class,
            OwnedByOneAgent::class,
            Linkable::class,
            LinkAccess::class,
            LinkTypes::class,
            LinkTypeRenames::class,
            StateSubjectMissing::class,
            StackTargetRefused::class,
            StackLockTimedOut::class,
            StackTransactionRequired::class,
        ];
    }
}
