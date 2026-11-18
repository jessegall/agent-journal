<?php

declare(strict_types=1);

namespace App\Core;

use App\Core\Actors\Contracts\Actor;
use App\Core\Actors\Contracts\CurrentActor;
use App\Core\Actors\Contracts\CurrentActorSetter;
use App\Core\Actors\Enums\ActorType;
use App\Core\Actors\Exceptions\ActorContextMissing;
use App\Core\Actors\Exceptions\AgentActorRequired;
use App\Core\Actors\Exceptions\InvalidActorText;
use App\Core\Actors\Exceptions\UserActorRequired;
use App\Core\Actors\Support\ActorContext;
use App\Core\Actors\Support\ActorIdentity;
use App\Core\Actors\Support\CurrentUser;
use App\Core\AgentRequests\Contracts\AgentRequestSender;
use App\Core\AgentRequests\Exceptions\AgentRequestFailed;
use App\Core\AgentRequests\Support\AgentReply;
use App\Core\Agents\Contracts\AgentReader;
use App\Core\Agents\Contracts\AgentRetirement;
use App\Core\Agents\Contracts\SessionReader;
use App\Core\Agents\Exceptions\AgentNotAvailable;
use App\Core\Agents\Exceptions\AgentRetirementDenied;
use App\Core\Agents\Exceptions\StackTargetRefused;
use App\Core\Agents\Support\AgentLabel;
use App\Core\Agents\Support\SessionOption;
use App\Core\Agents\Support\StackTarget;
use App\Core\Assignments\Contracts\Assignable;
use App\Core\Assignments\Contracts\AssignableProvider;
use App\Core\Assignments\Contracts\Assignee;
use App\Core\Assignments\Contracts\AssigneeProvider;
use App\Core\Assignments\Contracts\AssigneeReader;
use App\Core\Assignments\Contracts\AssignmentReader;
use App\Core\Assignments\Contracts\AssignmentRegistration;
use App\Core\Assignments\Contracts\AssignmentTransaction;
use App\Core\Assignments\Contracts\AssignmentWriter;
use App\Core\Assignments\Enums\AssignmentOutcomeType;
use App\Core\Assignments\Enums\AssignmentReason;
use App\Core\Assignments\Events\AssignmentsChanged;
use App\Core\Assignments\Exceptions\AssigneeTypeRepeated;
use App\Core\Assignments\Exceptions\AssigneeUnavailable;
use App\Core\Assignments\Exceptions\AssignmentConflict;
use App\Core\Assignments\Exceptions\AssignmentDenied;
use App\Core\Assignments\Exceptions\AssignmentGroupTooLarge;
use App\Core\Assignments\Exceptions\AssignmentProviderInvalid;
use App\Core\Assignments\Exceptions\AssignmentRetryExhausted;
use App\Core\Assignments\Exceptions\AssignmentRootFinished;
use App\Core\Assignments\Exceptions\AssignmentTransactionRequired;
use App\Core\Assignments\Exceptions\AssignmentTypeRepeated;
use App\Core\Assignments\Exceptions\AssignmentTypeUnavailable;
use App\Core\Assignments\Exceptions\InvalidAssignmentIdentity;
use App\Core\Assignments\Exceptions\InvalidAssignmentPage;
use App\Core\Assignments\Exceptions\RecordUnavailable;
use App\Core\Assignments\Http\Data\RecordHolderData;
use App\Core\Assignments\Models\Support\AssignableListing;
use App\Core\Assignments\Support\AssigneeList;
use App\Core\Assignments\Support\AssigneeName;
use App\Core\Assignments\Support\AssigneeRegistration;
use App\Core\Assignments\Support\Assignment;
use App\Core\Assignments\Support\AssignmentChange;
use App\Core\Assignments\Support\AssignmentData;
use App\Core\Assignments\Support\AssignmentGroup;
use App\Core\Assignments\Support\AssignmentHolder;
use App\Core\Assignments\Support\AssignmentHolders;
use App\Core\Assignments\Support\AssignmentOutcome;
use App\Core\Assignments\Support\AssignmentReference;
use App\Core\Assignments\Support\AssignmentResult;
use App\Core\Assignments\Support\AssignmentSet;
use App\Core\Assignments\Support\NumberedPage;
use App\Core\Assignments\Support\Page;
use App\Core\Assignments\Support\RecordIdentity;
use App\Core\Assignments\Support\RecordIds;
use App\Core\Bus\Attributes\HandledBy;
use App\Core\Bus\Attributes\RepeatableRead;
use App\Core\Bus\Attributes\RequiresActor;
use App\Core\Bus\Contracts\Command;
use App\Core\Bus\Contracts\CommandBus;
use App\Core\Bus\Contracts\CommandMiddleware;
use App\Core\Bus\Contracts\CommandRefusal;
use App\Core\Bus\Contracts\ProvidesCommandMiddleware;
use App\Core\Bus\Contracts\ProvidesCommands;
use App\Core\Bus\Enums\CommandScopeType;
use App\Core\Bus\Enums\MiddlewareStage;
use App\Core\Bus\Exceptions\CommandDeclarationInvalid;
use App\Core\Bus\Exceptions\CommandHandlerMissing;
use App\Core\Bus\Exceptions\CommandHandlerTwice;
use App\Core\Bus\Exceptions\CommandListedTwice;
use App\Core\Bus\Exceptions\CommandNestingTooDeep;
use App\Core\Bus\Exceptions\CommandNotRegistered;
use App\Core\Bus\Exceptions\CommandRefused;
use App\Core\Bus\Exceptions\CommandReplacedWithOtherClass;
use App\Core\Bus\Exceptions\CommandReplacementRefused;
use App\Core\Bus\Exceptions\CommandResultChanged;
use App\Core\Bus\Exceptions\CommandRetryExhausted;
use App\Core\Bus\Exceptions\CommandTransactionMismatch;
use App\Core\Bus\Exceptions\ContinuationCalledTwice;
use App\Core\Bus\Exceptions\ExplicitTransactionInCommand;
use App\Core\Bus\Exceptions\HandlerInOtherOwner;
use App\Core\Bus\Exceptions\HandlerServesTwoCommands;
use App\Core\Bus\Exceptions\MiddlewareDeclarationInvalid;
use App\Core\Bus\Exceptions\MiddlewareListedTwice;
use App\Core\Bus\Exceptions\MiddlewareSkippedCommand;
use App\Core\Bus\Exceptions\MiddlewareSwallowedFailure;
use App\Core\Bus\Exceptions\NestedCommandFailureIgnored;
use App\Core\Bus\Support\CommandCall;
use App\Core\Bus\Support\CommandScope;
use App\Core\Bus\Support\MiddlewareDeclaration;
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
use App\Core\Hooks\Enums\AnswerType;
use App\Core\Hooks\Enums\CommandEffect;
use App\Core\Hooks\Enums\CommandType;
use App\Core\Hooks\Enums\FileOperation;
use App\Core\Hooks\Enums\NoSubject;
use App\Core\Hooks\Enums\ParseOutcome;
use App\Core\Hooks\Enums\PartJoin;
use App\Core\Hooks\Enums\SessionEndReason;
use App\Core\Hooks\Enums\SessionStartSource;
use App\Core\Hooks\Enums\ShellDialect;
use App\Core\Hooks\Enums\ToolOutcome;
use App\Core\Hooks\Enums\TransitionType;
use App\Core\Hooks\Events\ContextWasCompacted;
use App\Core\Hooks\Events\StateTypesRequested;
use App\Core\Hooks\Exceptions\StackLockTimedOut;
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
use App\Core\Hooks\Models\Support\BelongsToOneAgent;
use App\Core\Hooks\States\AgentState;
use App\Core\Links\Exceptions\UnknownLinkType;
use App\Core\Links\Support\Linkable;
use App\Core\Links\Support\LinkAccess;
use App\Core\Links\Support\LinkTypeRegistry;
use App\Core\Links\Support\LinkTypeRenames;
use App\Core\Queries\Support\TextSearch;
use App\Core\Ui\Contracts\CountReader;
use App\Core\Ui\Contracts\NavigationChildren;
use App\Core\Ui\Contracts\PageOption;
use App\Core\Ui\Contracts\PageReader;
use App\Core\Ui\Contracts\ProvidesNavigation;
use App\Core\Ui\Contracts\ProvidesPages;
use App\Core\Ui\Contracts\ProvidesSections;
use App\Core\Ui\Contracts\SectionReader;
use App\Core\Ui\Contracts\UpdatesUserInterface;
use App\Core\Ui\Contracts\VisibilityCheck;
use App\Core\Ui\Declarations\ActionRoute;
use App\Core\Ui\Declarations\ChoiceOption;
use App\Core\Ui\Declarations\FloatSize;
use App\Core\Ui\Declarations\NavigationItem;
use App\Core\Ui\Declarations\Page as UiPage;
use App\Core\Ui\Declarations\Section;
use App\Core\Ui\Declarations\Slot;
use App\Core\Ui\Declarations\SlotContext;
use App\Core\Ui\Declarations\ToggleOption;
use App\Core\Ui\Enums\ActionMethod;
use App\Core\Ui\Enums\Icon;
use App\Core\Ui\Enums\PageDestination;
use App\Core\Ui\Enums\PageSkeleton;
use App\Core\Ui\Enums\SlotContextType;
use App\Core\Web\Contracts\CurrentUserReader;
use App\Core\Web\Contracts\JournalAccessPolicy;
use App\Core\Web\Http\Requests\Concerns\ReadsRouteId;

/**
 * Core's public surface: every type a domain or module may use, written out one by one. Everything else in Core is
 * private, whatever folder it sits in. Core is not a domain and is never required; domains use it without declaring it.
 * CurrentActorSetter, LinkTypeRegistry and LinkTypeRenames are listed for the few places that compose the application (the
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
            ActorType::class,
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
            AnswerType::class,
            StackTransition::class,
            TransitionType::class,
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
            CommandType::class,
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
            BelongsToOneAgent::class,
            Linkable::class,
            LinkAccess::class,
            LinkTypeRegistry::class,
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
            AssignmentOutcomeType::class,
            InvalidAssignmentIdentity::class,
            InvalidAssignmentPage::class,
            AssignmentGroupTooLarge::class,
            AssigneeUnavailable::class,
            RecordUnavailable::class,
            AssignmentRootFinished::class,
            AssignmentData::class,
            RecordHolderData::class,
            InvalidActorText::class,
            AgentRequestSender::class,
            AgentRequestFailed::class,
            AgentReply::class,
            AgentNotAvailable::class,
            AgentRetirementDenied::class,
            AgentRetirement::class,
            AssignableListing::class,
            NumberedPage::class,
            AgentActorRequired::class,
            AssignmentHolders::class,
            AssignmentHolder::class,
            AssigneeReader::class,
            AssignmentsChanged::class,
            AssignmentDenied::class,
            AssignmentWriter::class,
            AssignmentConflict::class,
            AssignmentRetryExhausted::class,
            AssignmentTransactionRequired::class,
            AssignmentTransaction::class,
            AssignmentTypeUnavailable::class,
            AssignmentProviderInvalid::class,
            AssigneeTypeRepeated::class,
            AssignmentTypeRepeated::class,
            CurrentUserReader::class,
            Command::class,
            CommandBus::class,
            CommandMiddleware::class,
            CommandRefusal::class,
            ProvidesCommands::class,
            ProvidesCommandMiddleware::class,
            HandledBy::class,
            RepeatableRead::class,
            RequiresActor::class,
            MiddlewareStage::class,
            CommandScopeType::class,
            CommandScope::class,
            MiddlewareDeclaration::class,
            CommandCall::class,
            CommandDeclarationInvalid::class,
            CommandHandlerMissing::class,
            CommandHandlerTwice::class,
            CommandListedTwice::class,
            CommandNestingTooDeep::class,
            CommandNotRegistered::class,
            CommandRefused::class,
            CommandReplacedWithOtherClass::class,
            CommandReplacementRefused::class,
            CommandResultChanged::class,
            CommandRetryExhausted::class,
            CommandTransactionMismatch::class,
            ContinuationCalledTwice::class,
            ExplicitTransactionInCommand::class,
            HandlerInOtherOwner::class,
            HandlerServesTwoCommands::class,
            MiddlewareDeclarationInvalid::class,
            MiddlewareListedTwice::class,
            MiddlewareSkippedCommand::class,
            MiddlewareSwallowedFailure::class,
            NestedCommandFailureIgnored::class,
            TextSearch::class,
            ReadsRouteId::class,
            JournalAccessPolicy::class,
            CurrentUser::class,
            UpdatesUserInterface::class,
            CountReader::class,
            NavigationChildren::class,
            PageOption::class,
            PageReader::class,
            ProvidesNavigation::class,
            ProvidesPages::class,
            ProvidesSections::class,
            SectionReader::class,
            VisibilityCheck::class,
            ActionRoute::class,
            ChoiceOption::class,
            FloatSize::class,
            NavigationItem::class,
            UiPage::class,
            Section::class,
            Slot::class,
            SlotContext::class,
            ToggleOption::class,
            ActionMethod::class,
            Icon::class,
            PageDestination::class,
            PageSkeleton::class,
            SlotContextType::class,
        ];
    }
}
