<?php

declare(strict_types=1);

namespace App;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\CurrentActor;
use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Enums\ActorType;
use App\Actors\Exceptions\ActorContextMissing;
use App\Actors\Exceptions\AgentActorRequired;
use App\Actors\Exceptions\InvalidActorText;
use App\Actors\Exceptions\UserActorRequired;
use App\Actors\Support\ActorContext;
use App\Actors\Support\ActorIdentity;
use App\Actors\Support\CurrentUser;
use App\AgentRequests\Contracts\AgentRequestSender;
use App\AgentRequests\Exceptions\AgentRequestFailed;
use App\AgentRequests\Support\AgentReply;
use App\Agents\Commands\RecordHeartbeat;
use App\Agents\Commands\RetireAgent;
use App\Agents\Contracts\AgentReader;
use App\Agents\Contracts\CurrentSession;
use App\Agents\Contracts\SessionReader;
use App\Agents\Events\LaunchEnded;
use App\Agents\Exceptions\AgentContextMissing;
use App\Agents\Exceptions\AgentNotAvailable;
use App\Agents\Exceptions\AgentRetirementDenied;
use App\Agents\Exceptions\StackTargetRefused;
use App\Agents\Support\AgentLabel;
use App\Agents\Support\SessionOption;
use App\Agents\Support\StackTarget;
use App\Assignments\Commands\AssignRecord;
use App\Assignments\Commands\ReassignRecord;
use App\Assignments\Commands\UnassignRecord;
use App\Assignments\Contracts\Assignable;
use App\Assignments\Contracts\AssignableProvider;
use App\Assignments\Contracts\Assignee;
use App\Assignments\Contracts\AssigneeProvider;
use App\Assignments\Contracts\AssigneeReader;
use App\Assignments\Contracts\AssignmentReader;
use App\Assignments\Contracts\AssignmentRegistration;
use App\Assignments\Contracts\AssignmentTransaction;
use App\Assignments\Contracts\AssignmentWriter;
use App\Assignments\Enums\AssignmentOutcomeType;
use App\Assignments\Enums\AssignmentReason;
use App\Assignments\Events\AssignmentsChanged;
use App\Assignments\Exceptions\AssigneeTypeRepeated;
use App\Assignments\Exceptions\AssigneeUnavailable;
use App\Assignments\Exceptions\AssignmentConflict;
use App\Assignments\Exceptions\AssignmentDenied;
use App\Assignments\Exceptions\AssignmentGroupTooLarge;
use App\Assignments\Exceptions\AssignmentProviderInvalid;
use App\Assignments\Exceptions\AssignmentRetryExhausted;
use App\Assignments\Exceptions\AssignmentRootFinished;
use App\Assignments\Exceptions\AssignmentTransactionRequired;
use App\Assignments\Exceptions\AssignmentTypeRepeated;
use App\Assignments\Exceptions\AssignmentTypeUnavailable;
use App\Assignments\Exceptions\InvalidAssignmentIdentity;
use App\Assignments\Exceptions\InvalidAssignmentPage;
use App\Assignments\Exceptions\RecordUnavailable;
use App\Assignments\Models\Support\AssignableListing;
use App\Assignments\Support\AssigneeList;
use App\Assignments\Support\AssigneeName;
use App\Assignments\Support\AssigneeRegistration;
use App\Assignments\Support\Assignment;
use App\Assignments\Support\AssignmentChange;
use App\Assignments\Support\AssignmentData;
use App\Assignments\Support\AssignmentGroup;
use App\Assignments\Support\AssignmentHolder;
use App\Assignments\Support\AssignmentHolders;
use App\Assignments\Support\AssignmentOutcome;
use App\Assignments\Support\AssignmentReference;
use App\Assignments\Support\AssignmentResult;
use App\Assignments\Support\AssignmentSet;
use App\Assignments\Support\NumberedPage;
use App\Assignments\Support\Page;
use App\Assignments\Support\RecordIdentity;
use App\Assignments\Support\RecordIds;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Attributes\RequiresActor;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\CommandBus;
use App\Bus\Contracts\CommandMiddleware;
use App\Bus\Contracts\ProvidesCommandMiddleware;
use App\Bus\Contracts\ProvidesCommands;
use App\Bus\Enums\CommandScopeType;
use App\Bus\Enums\MiddlewareStage;
use App\Bus\Exceptions\CommandDeclarationInvalid;
use App\Bus\Exceptions\CommandHandlerMissing;
use App\Bus\Exceptions\CommandHandlerTwice;
use App\Bus\Exceptions\CommandListedTwice;
use App\Bus\Exceptions\CommandNestingTooDeep;
use App\Bus\Exceptions\CommandNotRegistered;
use App\Bus\Exceptions\CommandRefused;
use App\Bus\Exceptions\CommandReplacedWithOtherClass;
use App\Bus\Exceptions\CommandReplacementRefused;
use App\Bus\Exceptions\CommandResultChanged;
use App\Bus\Exceptions\CommandRetryExhausted;
use App\Bus\Exceptions\CommandTransactionMismatch;
use App\Bus\Exceptions\CommandTransactionMissing;
use App\Bus\Exceptions\ContinuationCalledTwice;
use App\Bus\Exceptions\ExplicitTransactionInCommand;
use App\Bus\Exceptions\HandlerInOtherOwner;
use App\Bus\Exceptions\HandlerServesTwoCommands;
use App\Bus\Exceptions\MiddlewareDeclarationInvalid;
use App\Bus\Exceptions\MiddlewareListedTwice;
use App\Bus\Exceptions\MiddlewareSkippedCommand;
use App\Bus\Exceptions\MiddlewareSwallowedFailure;
use App\Bus\Exceptions\NestedCommandFailureIgnored;
use App\Bus\Exceptions\StackLockTimedOut;
use App\Bus\Support\CommandCall;
use App\Bus\Support\CommandScope;
use App\Bus\Support\MiddlewareDeclaration;
use App\Contracts\CommandHandler;
use App\Contracts\CommandRefusal;
use App\Contracts\Event;
use App\Contracts\Listener;
use App\Exports\Exceptions\MalformedExports;
use App\Exports\Support\ExportBuilder;
use App\Exports\Support\Exports;
use App\Hooks\Contracts\AgentStack;
use App\Hooks\Contracts\Answer;
use App\Hooks\Contracts\CurrentState;
use App\Hooks\Contracts\HookAnswerer;
use App\Hooks\Contracts\HookInput;
use App\Hooks\Contracts\ReminderContribution;
use App\Hooks\Contracts\ShellCommandParser;
use App\Hooks\Contracts\StackCleanup;
use App\Hooks\Contracts\StackEditor;
use App\Hooks\Contracts\StackTransactionRunner;
use App\Hooks\Contracts\StackTransition;
use App\Hooks\Contracts\StateLoader;
use App\Hooks\Contracts\StateRegistration;
use App\Hooks\Contracts\UserStack;
use App\Hooks\Contracts\WorkedOnStack;
use App\Hooks\Decisions\Decision;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\StateReferenceFactory;
use App\Hooks\Decisions\StateReferences;
use App\Hooks\Decisions\StateSet;
use App\Hooks\Decisions\SubjectReference;
use App\Hooks\Enums\AnswerType;
use App\Hooks\Enums\CommandEffect;
use App\Hooks\Enums\CommandType;
use App\Hooks\Enums\FileOperation;
use App\Hooks\Enums\NoSubject;
use App\Hooks\Enums\ParseOutcome;
use App\Hooks\Enums\PartJoin;
use App\Hooks\Enums\SessionEndReason;
use App\Hooks\Enums\SessionStartSource;
use App\Hooks\Enums\ShellDialect;
use App\Hooks\Enums\ToolOutcome;
use App\Hooks\Enums\TransitionType;
use App\Hooks\Events\ContextWasCompacted;
use App\Hooks\Events\StateTypesRequested;
use App\Hooks\Exceptions\StackTransactionRequired;
use App\Hooks\Exceptions\StateReferencesInvalid;
use App\Hooks\Exceptions\StateSubjectMissing;
use App\Hooks\Exceptions\StateTypeMissing;
use App\Hooks\Exceptions\StateTypeRepeated;
use App\Hooks\Exceptions\StateTypesFrozen;
use App\Hooks\Inputs\CommandPart;
use App\Hooks\Inputs\CompactionDetails;
use App\Hooks\Inputs\ContextCompacted;
use App\Hooks\Inputs\FileChange;
use App\Hooks\Inputs\FileChanges;
use App\Hooks\Inputs\FileEditRequested;
use App\Hooks\Inputs\HookIdentity;
use App\Hooks\Inputs\PromptDetails;
use App\Hooks\Inputs\PromptSubmitted;
use App\Hooks\Inputs\SessionEndDetails;
use App\Hooks\Inputs\SessionEnded;
use App\Hooks\Inputs\SessionStartDetails;
use App\Hooks\Inputs\SessionStarted;
use App\Hooks\Inputs\ShellCommand;
use App\Hooks\Inputs\ShellCommandRequested;
use App\Hooks\Inputs\StopDetails;
use App\Hooks\Inputs\StopRequested;
use App\Hooks\Inputs\ToolFinished;
use App\Hooks\Inputs\ToolResult;
use App\Hooks\Lifecycle\LifecycleContext;
use App\Hooks\Models\Support\BelongsToOneAgent;
use App\Hooks\States\AgentState;
use App\Http\Data\Assignments\RecordHolderData;
use App\Http\Requests\Web\Concerns\ReadsRouteNumber;
use App\Links\Exceptions\UnknownLinkType;
use App\Links\Support\Linkable;
use App\Links\Support\LinkAccess;
use App\Links\Support\LinkTypeRegistry;
use App\Numbers\Commands\InstallNumbers;
use App\Numbers\Contracts\Numbered;
use App\Numbers\Contracts\ProvidesNumberedModels;
use App\Numbers\Exceptions\InvalidRecordReference;
use App\Numbers\Support\HasNumber;
use App\Numbers\Support\NumberedModel;
use App\Numbers\Support\RecordReference;
use App\Queries\Support\TextSearch;
use App\Reads\Attributes\ReadBudget;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Contracts\ReadMeter;
use App\Reads\Enums\ReadMode;
use App\Reads\Exceptions\LazyLoadRefused;
use App\Reads\Exceptions\ModelReadAllRefused;
use App\Reads\Exceptions\QueryInValueRead;
use App\Reads\Exceptions\ReadLimitExceeded;
use App\Reads\Exceptions\ReadLimitInvalid;
use App\Reads\Exceptions\ReadLimitTooLarge;
use App\Reads\Exceptions\ReadPolicyMissing;
use App\Reads\Exceptions\ReadReasonMissing;
use App\Reads\Exceptions\ReadShapeUnsupported;
use App\Reads\Exceptions\RelationReadUndeclared;
use App\Reads\Support\BoundedReads;
use App\Reads\Support\CountsLoads;
use App\Reads\Support\CountsPivotLoads;
use App\Reads\Support\ReadBuilder;
use App\Reads\Values\Measurement;
use App\Reads\Values\PageSize;
use App\Reads\Values\ReadCounts;
use App\Reads\Values\ReadOrder;
use App\Reads\Values\RelationRead;
use App\Records\Commands\LinkRecords;
use App\Records\Commands\UnlinkRecords;
use App\Records\Contracts\RecordLinker;
use App\Records\Contracts\RecordProvider;
use App\Records\Contracts\RecordReader;
use App\Records\Data\RecordCard;
use App\Records\Support\ProvidesModelRecords;
use App\Settings\Contracts\ChoiceLabel;
use App\Settings\Contracts\GroupDeclaration;
use App\Settings\Contracts\ProvidesSettings;
use App\Settings\Contracts\Setting;
use App\Settings\Contracts\SettingsDefinition;
use App\Settings\Declarations\BooleanSetting;
use App\Settings\Declarations\ChoiceSetting;
use App\Settings\Declarations\DecimalSetting;
use App\Settings\Declarations\EnumSetting;
use App\Settings\Declarations\IntegerSetting;
use App\Settings\Declarations\SettingGroup;
use App\Settings\Declarations\StringSetting;
use App\Settings\Declarations\ToggleGroup;
use App\Settings\Enums\SettingType;
use App\Settings\Exceptions\DecimalInvalid;
use App\Settings\Exceptions\SettingDeclarationInvalid;
use App\Settings\Exceptions\SettingHandleUnknown;
use App\Settings\Values\Choice;
use App\Settings\Values\Decimal;
use App\Ui\Contracts\CountReader;
use App\Ui\Contracts\NavigationChildren;
use App\Ui\Contracts\PageOption;
use App\Ui\Contracts\PageReader;
use App\Ui\Contracts\ProvidesNavigation;
use App\Ui\Contracts\ProvidesPages;
use App\Ui\Contracts\ProvidesSections;
use App\Ui\Contracts\SectionReader;
use App\Ui\Contracts\UpdatesUserInterface;
use App\Ui\Contracts\VisibilityCheck;
use App\Ui\Declarations\ActionRoute;
use App\Ui\Declarations\ChoiceOption;
use App\Ui\Declarations\FloatSize;
use App\Ui\Declarations\NavigationItem;
use App\Ui\Declarations\Page as UiPage;
use App\Ui\Declarations\Section;
use App\Ui\Declarations\Slot;
use App\Ui\Declarations\SlotContext;
use App\Ui\Declarations\ToggleOption;
use App\Ui\Enums\ActionMethod;
use App\Ui\Enums\Icon;
use App\Ui\Enums\PageDestination;
use App\Ui\Enums\PageSkeleton;
use App\Ui\Enums\SlotContextType;
use App\Web\Contracts\CurrentUserReader;
use App\Web\Contracts\JournalAccessPolicy;

/**
 * Core's public surface: every type a domain or module may use, written out one by one. Everything else in Core is
 * private, whatever folder it sits in. Core is not a domain and is never required; domains use it without declaring it.
 * CurrentActorSetter and LinkTypeRegistry are listed for the few places that compose the application (the
 * sign-in middleware and owner providers), not for ordinary use.
 */
final class CoreApi
{
    public static function exports(): Exports
    {
        return Exports::make()
            ->events(ContextWasCompacted::class, StateTypesRequested::class, AssignmentsChanged::class, LaunchEnded::class)
            ->contracts(
                RecordProvider::class,
                RecordReader::class,
                RecordLinker::class,
                CurrentSession::class,
                ReadableModel::class,
                ReadMeter::class,
                Actor::class,
                CurrentActor::class,
                CurrentActorSetter::class,
                AgentReader::class,
                SessionReader::class,
                AgentStack::class,
                UserStack::class,
                StackTransactionRunner::class,
                StateLoader::class,
                Answer::class,
                StackTransition::class,
                StackEditor::class,
                StackCleanup::class,
                CurrentState::class,
                WorkedOnStack::class,
                ShellCommandParser::class,
                HookAnswerer::class,
                HookInput::class,
                StateRegistration::class,
                ReminderContribution::class,
                Assignee::class,
                Assignable::class,
                AssignableProvider::class,
                AssigneeProvider::class,
                AssignmentReader::class,
                AssignmentRegistration::class,
                AgentRequestSender::class,
                Numbered::class,
                ProvidesNumberedModels::class,
                AssigneeReader::class,
                AssignmentWriter::class,
                AssignmentTransaction::class,
                CurrentUserReader::class,
                Command::class,
                CommandBus::class,
                CommandMiddleware::class,
                CommandRefusal::class,
                Event::class,
                Listener::class,
                CommandHandler::class,
                ProvidesCommands::class,
                ProvidesCommandMiddleware::class,
                JournalAccessPolicy::class,
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
                ProvidesSettings::class,
                Setting::class,
                SettingsDefinition::class,
                GroupDeclaration::class,
                ChoiceLabel::class,
            )
            ->values(
                RecordCard::class,
                StateReferences::class,
                StateSet::class,
                ReadMode::class,
                ReadOrder::class,
                PageSize::class,
                RelationRead::class,
                ReadBudget::class,
                ReadCounts::class,
                Measurement::class,
                ActorType::class,
                ActorContext::class,
                AgentLabel::class,
                SessionOption::class,
                StackTarget::class,
                Decision::class,
                AnswerType::class,
                TransitionType::class,
                StateReference::class,
                LifecycleContext::class,
                NoSubject::class,
                SubjectReference::class,
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
                ActorIdentity::class,
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
                AssignmentData::class,
                RecordHolderData::class,
                AgentReply::class,
                NumberedModel::class,
                RecordReference::class,
                Exports::class,
                ExportBuilder::class,
                NumberedPage::class,
                AssignmentHolders::class,
                AssignmentHolder::class,
                HandledBy::class,
                RepeatableRead::class,
                RequiresActor::class,
                MiddlewareStage::class,
                CommandScopeType::class,
                CommandScope::class,
                MiddlewareDeclaration::class,
                CommandCall::class,
                CurrentUser::class,
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
                StringSetting::class,
                SettingGroup::class,
                ToggleGroup::class,
                BooleanSetting::class,
                IntegerSetting::class,
                DecimalSetting::class,
                Decimal::class,
                ChoiceSetting::class,
                EnumSetting::class,
                Choice::class,
                SettingType::class,
            )
            ->commands(
                RetireAgent::class,
                RecordHeartbeat::class,
                InstallNumbers::class,
                LinkRecords::class,
                UnlinkRecords::class,
                AssignRecord::class,
                ReassignRecord::class,
                UnassignRecord::class,
            )
            ->exceptions(
                SettingDeclarationInvalid::class,
                SettingHandleUnknown::class,
                DecimalInvalid::class,
                CommandTransactionMissing::class,
                AgentContextMissing::class,
                ReadPolicyMissing::class,
                QueryInValueRead::class,
                LazyLoadRefused::class,
                StateReferencesInvalid::class,
                StateTypeMissing::class,
                ReadLimitInvalid::class,
                ReadLimitTooLarge::class,
                ReadReasonMissing::class,
                ModelReadAllRefused::class,
                ReadShapeUnsupported::class,
                ReadLimitExceeded::class,
                RelationReadUndeclared::class,
                ActorContextMissing::class,
                UserActorRequired::class,
                StateTypeRepeated::class,
                StateTypesFrozen::class,
                UnknownLinkType::class,
                StateSubjectMissing::class,
                StackTargetRefused::class,
                StackLockTimedOut::class,
                StackTransactionRequired::class,
                InvalidAssignmentIdentity::class,
                InvalidAssignmentPage::class,
                AssignmentGroupTooLarge::class,
                AssigneeUnavailable::class,
                RecordUnavailable::class,
                AssignmentRootFinished::class,
                InvalidActorText::class,
                AgentRequestFailed::class,
                AgentNotAvailable::class,
                AgentRetirementDenied::class,
                InvalidRecordReference::class,
                MalformedExports::class,
                AgentActorRequired::class,
                AssignmentDenied::class,
                AssignmentConflict::class,
                AssignmentRetryExhausted::class,
                AssignmentTransactionRequired::class,
                AssignmentTypeUnavailable::class,
                AssignmentProviderInvalid::class,
                AssigneeTypeRepeated::class,
                AssignmentTypeRepeated::class,
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
            )
            ->support(
                BoundedReads::class,
                ReadBuilder::class,
                CountsLoads::class,
                CountsPivotLoads::class,
                AgentState::class,
                BelongsToOneAgent::class,
                Linkable::class,
                LinkAccess::class,
                LinkTypeRegistry::class,
                StateReferenceFactory::class,
                ProvidesModelRecords::class,
                HasNumber::class,
                AssignableListing::class,
                TextSearch::class,
                ReadsRouteNumber::class,
            )
            ->build();
    }

    /**
     * The Listeners folder of each Core area that has one, for the checked listener provider to discover.
     *
     * @return list<string>
     */
    public static function listenerFolders(): array
    {
        return glob(__DIR__.'/*/Listeners', GLOB_ONLYDIR) ?: [];
    }
}
