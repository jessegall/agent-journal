<?php

declare(strict_types=1);

namespace App\Core;

use App\Core\Actors\Enums\ActorKind;
use App\Core\Actors\Exceptions\ActorContextMissing;
use App\Core\Actors\Exceptions\UserActorRequired;
use App\Core\Actors\Support\ActorContext;
use App\Core\Actors\Support\ActorIdentity;
use App\Core\Agents\Contracts\AgentReader;
use App\Core\Agents\Contracts\SessionReader;
use App\Core\Agents\Support\AgentLabel;
use App\Core\Agents\Support\SessionOption;
use App\Core\Assignments\Contracts\AssignableProvider;
use App\Core\Assignments\Contracts\AssigneeProvider;
use App\Core\Assignments\Contracts\AssignmentReader;
use App\Core\Assignments\Contracts\AssignmentRegistration;
use App\Core\Assignments\Contracts\AssignmentTransaction;
use App\Core\Assignments\Contracts\AssignmentWriter;
use App\Core\Assignments\Enums\AssignmentOutcomeKind;
use App\Core\Assignments\Enums\AssignmentReason;
use App\Core\Assignments\Exceptions\AssigneeKindRepeated;
use App\Core\Assignments\Exceptions\AssigneeUnavailable;
use App\Core\Assignments\Exceptions\AssignmentConflict;
use App\Core\Assignments\Exceptions\AssignmentDenied;
use App\Core\Assignments\Exceptions\AssignmentGroupTooLarge;
use App\Core\Assignments\Exceptions\AssignmentProviderInvalid;
use App\Core\Assignments\Exceptions\AssignmentRetryExhausted;
use App\Core\Assignments\Exceptions\AssignmentTransactionRequired;
use App\Core\Assignments\Exceptions\AssignmentTypeRepeated;
use App\Core\Assignments\Exceptions\AssignmentTypeUnavailable;
use App\Core\Assignments\Exceptions\InvalidAssignmentIdentity;
use App\Core\Assignments\Exceptions\InvalidAssignmentPage;
use App\Core\Assignments\Exceptions\RecordUnavailable;
use App\Core\Assignments\Support\AssigneeList;
use App\Core\Assignments\Support\AssigneeName;
use App\Core\Assignments\Support\AssigneeRegistration;
use App\Core\Assignments\Support\Assignment;
use App\Core\Assignments\Support\AssignmentChange;
use App\Core\Assignments\Support\AssignmentGroup;
use App\Core\Assignments\Support\AssignmentOutcome;
use App\Core\Assignments\Support\AssignmentReference;
use App\Core\Assignments\Support\AssignmentResult;
use App\Core\Assignments\Support\AssignmentSet;
use App\Core\Assignments\Support\Page;
use App\Core\Assignments\Support\RecordIdentity;
use App\Core\Assignments\Support\RecordIds;
use App\Core\Contracts\Actor;
use App\Core\Contracts\Assignable;
use App\Core\Contracts\Assignee;
use App\Core\Contracts\CurrentActor;
use App\Core\Contracts\CurrentActorSetter;
use App\Core\Hooks\Contracts\AgentStack;
use App\Core\Hooks\Contracts\Answer;
use App\Core\Hooks\Contracts\HookAnswerer;
use App\Core\Hooks\Contracts\HookInput;
use App\Core\Hooks\Contracts\ReminderContribution;
use App\Core\Hooks\Contracts\ShellCommandParser;
use App\Core\Hooks\Contracts\StackEditor;
use App\Core\Hooks\Contracts\StackTransactionRunner;
use App\Core\Hooks\Contracts\StackTransition;
use App\Core\Hooks\Contracts\StateRegistration;
use App\Core\Hooks\Contracts\StateType;
use App\Core\Hooks\Contracts\UserStack;
use App\Core\Hooks\Decisions\Decision;
use App\Core\Hooks\Decisions\StateReference;
use App\Core\Hooks\Decisions\SubjectReference;
use App\Core\Hooks\Enums\AnswerKind;
use App\Core\Hooks\Enums\CommandEffect;
use App\Core\Hooks\Enums\CommandKind;
use App\Core\Hooks\Enums\FileOperation;
use App\Core\Hooks\Enums\NoSubject;
use App\Core\Hooks\Enums\ParseOutcome;
use App\Core\Hooks\Enums\PartJoin;
use App\Core\Hooks\Enums\SessionEndReason;
use App\Core\Hooks\Enums\SessionStartSource;
use App\Core\Hooks\Enums\ShellDialect;
use App\Core\Hooks\Enums\ToolOutcome;
use App\Core\Hooks\Enums\TransitionKind;
use App\Core\Hooks\Events\ContextWasCompacted;
use App\Core\Hooks\Events\StateTypesRequested;
use App\Core\Hooks\Exceptions\StackLockTimedOut;
use App\Core\Hooks\Exceptions\StackTargetRefused;
use App\Core\Hooks\Exceptions\StackTransactionRequired;
use App\Core\Hooks\Exceptions\StateSubjectMissing;
use App\Core\Hooks\Exceptions\StateTypeRepeated;
use App\Core\Hooks\Exceptions\StateTypesFrozen;
use App\Core\Hooks\Inputs\CommandPart;
use App\Core\Hooks\Inputs\CompactionDetails;
use App\Core\Hooks\Inputs\ContextCompacted;
use App\Core\Hooks\Inputs\FileChange;
use App\Core\Hooks\Inputs\FileChanges;
use App\Core\Hooks\Inputs\FileEditRequested;
use App\Core\Hooks\Inputs\HookIdentity;
use App\Core\Hooks\Inputs\PromptDetails;
use App\Core\Hooks\Inputs\PromptSubmitted;
use App\Core\Hooks\Inputs\SessionEndDetails;
use App\Core\Hooks\Inputs\SessionEnded;
use App\Core\Hooks\Inputs\SessionStartDetails;
use App\Core\Hooks\Inputs\SessionStarted;
use App\Core\Hooks\Inputs\ShellCommand;
use App\Core\Hooks\Inputs\ShellCommandRequested;
use App\Core\Hooks\Inputs\StopDetails;
use App\Core\Hooks\Inputs\StopRequested;
use App\Core\Hooks\Inputs\ToolFinished;
use App\Core\Hooks\Inputs\ToolResult;
use App\Core\Hooks\Models\Support\OwnedByOneAgent;
use App\Core\Hooks\States\AgentState;
use App\Core\Hooks\Support\StackTarget;
use App\Core\Links\Exceptions\UnknownLinkType;
use App\Core\Links\Support\Linkable;
use App\Core\Links\Support\LinkAccess;
use App\Core\Links\Support\LinkTypeRenames;
use App\Core\Links\Support\LinkTypes;

/**
 * Core's public surface: every type a domain or module may use, written out one by one. Everything else in Core is
 * private, whatever folder it sits in. Core is not a domain and is never required; domains use it without declaring it.
 * CurrentActorSetter, LinkTypes and LinkTypeRenames are listed for the few places that compose the application (the
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
            CurrentActorSetter::class,
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
            StackTransactionRunner::class,
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
            UnknownLinkType::class,
            StateSubjectMissing::class,
            StackTargetRefused::class,
            StackLockTimedOut::class,
            StackTransactionRequired::class,
            Assignee::class,
            Assignable::class,
            ActorIdentity::class,
            AssignableProvider::class,
            AssigneeProvider::class,
            AssignmentReader::class,
            AssignmentRegistration::class,
            RecordIdentity::class,
            AssigneeRegistration::class,
            Assignment::class,
            AssignmentReference::class,
            AssignmentSet::class,
            AssignmentGroup::class,
            AssignmentResult::class,
            AssignmentOutcome::class,
            AssignmentChange::class,
            Page::class,
            RecordIds::class,
            AssigneeList::class,
            AssigneeName::class,
            AssignmentReason::class,
            AssignmentOutcomeKind::class,
            InvalidAssignmentIdentity::class,
            InvalidAssignmentPage::class,
            AssignmentGroupTooLarge::class,
            AssigneeUnavailable::class,
            RecordUnavailable::class,
            AssignmentDenied::class,
            AssignmentWriter::class,
            AssignmentConflict::class,
            AssignmentRetryExhausted::class,
            AssignmentTransactionRequired::class,
            AssignmentTransaction::class,
            AssignmentTypeUnavailable::class,
            AssignmentProviderInvalid::class,
            AssigneeKindRepeated::class,
            AssignmentTypeRepeated::class,
        ];
    }
}
