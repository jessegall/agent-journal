<?php

declare(strict_types=1);

namespace App\Pages;

use App\Agents\Drivers\Contracts\NativePartProvider;
use App\CommandRules\Enums\AdmissionRefusalCode;
use App\CommandRules\Enums\AnalysisLimit;
use App\CommandRules\Enums\BindingType;
use App\CommandRules\Enums\ClassificationStatus;
use App\CommandRules\Enums\CommandClass;
use App\CommandRules\Enums\CommandEffect;
use App\CommandRules\Enums\CommandType;
use App\CommandRules\Enums\EmptyPolicy;
use App\CommandRules\Enums\EmptySelection;
use App\CommandRules\Enums\EvidenceSource;
use App\CommandRules\Enums\ExampleType;
use App\CommandRules\Enums\FramingType;
use App\CommandRules\Enums\JournalRouteType;
use App\CommandRules\Enums\NodeType;
use App\CommandRules\Enums\OperandType;
use App\CommandRules\Enums\Outcome;
use App\CommandRules\Enums\OutputEncoding;
use App\CommandRules\Enums\OutputRequirement;
use App\CommandRules\Enums\ParseOutcome;
use App\CommandRules\Enums\ProgressType;
use App\CommandRules\Enums\ProposalStatus;
use App\CommandRules\Enums\RedirectType;
use App\CommandRules\Enums\RequestHoldReason;
use App\CommandRules\Enums\RequestStatus;
use App\CommandRules\Enums\ScopeType;
use App\CommandRules\Enums\StepType;
use App\CommandRules\Enums\StreamUse;
use App\CommandRules\Enums\SummaryRule;
use App\CommandRules\Enums\TokenType;
use App\CommandRules\Enums\ToolType;
use App\CommandRules\Enums\UnresolvedType;
use App\CommandRules\Enums\UnsupportedKeyword;
use App\CommandRules\Enums\WordPlace;
use App\CommandRules\Enums\WordSegmentType;
use App\Data\Pages\RequestWindowData;
use App\Declarations\Page;
use App\Declarations\PageActions;
use App\Http\Controllers\ApproveBundlePageController;
use App\Http\Controllers\ApproveProposalPageController;
use App\Http\Controllers\ApproveSamplePageController;
use App\Http\Controllers\CleanRunPageController;
use App\Http\Controllers\RejectProposalPageController;
use App\Http\Controllers\RestoreRulePageController;
use App\Http\Controllers\RetireRulePageController;
use App\Http\Controllers\StopRunPageController;
use App\Http\Controllers\VerifyRestoredOutputPageController;
use App\Http\Pages\Resolvers\RequestListResolver;
use App\Http\Pages\Resolvers\RequestWindowResolver;
use App\Http\Pages\Resolvers\RunListResolver;
use App\Http\Pages\Resolvers\RunOutcomeWindowResolver;
use App\Http\Pages\Resolvers\RunWindowResolver;
use App\Navigation\Contracts\PageProvider;
use App\Navigation\Declarations\DomainClient;
use App\Navigation\Enums\Icon;
use App\Processes\Data\BundleListPartData;
use App\Processes\Data\BundleRowData;
use App\Processes\Data\ClassificationRuleRowData;
use App\Processes\Data\ClassificationSummaryData;
use App\Processes\Data\ExplainedNodeData;
use App\Processes\Data\ExplanationData;
use App\Processes\Data\HeldPartData;
use App\Processes\Data\PartOutputData;
use App\Processes\Data\PartSnapshotData;
use App\Processes\Data\PartSummaryData;
use App\Processes\Data\ProblemData;
use App\Processes\Data\ReaderProofData;
use App\Processes\Data\RequestRowData;
use App\Processes\Data\RunOutcomePageData;
use App\Processes\Data\RunOutcomeSummaryData;
use App\Processes\Data\RunRowData;
use App\Processes\Data\RunSnapshotData;
use App\Processes\Data\RunWindowData;
use App\Processes\Data\SampleData;
use App\Processes\Enums\AdmissionStatus;
use App\Processes\Enums\AssessmentOutcome;
use App\Processes\Enums\CaptureStatus;
use App\Processes\Enums\ClaimedOutcome;
use App\Processes\Enums\InterpretationStatus;
use App\Processes\Enums\LifecycleStatus;
use App\Processes\Enums\OutputStream;
use App\Processes\Enums\PartEndType;
use App\Processes\Enums\PartJoin;
use App\Processes\Enums\PartResultType;
use App\Processes\Enums\PositionPurpose;
use App\Processes\Enums\ProblemCode;
use App\Processes\Enums\ReviewLimit;
use App\Processes\Enums\RunEventType;
use App\Processes\Enums\RunLogicalResult;
use App\Processes\Enums\RunMode;
use App\Processes\Enums\RunRequestIntent;
use App\Processes\Enums\RunResultSource;
use App\Processes\Enums\ShellDialect;
use App\Profiles\Data\Pages\DeclarationData;
use App\Profiles\Data\ProposalData;
use App\Records\Contracts\TypeProvider;
use App\Records\Enums\RecordRole;

/**
 * The project owner's review of command classification: the requests by
 * state, the active and retired rules and the module bundles waiting, and one request with everything its approval
 * binds.
 */
final class ProcessPages implements NativePartProvider, PageProvider, TypeProvider
{
    /**
     * The native parts the process layouts mount: the bundle activations of the review list, one request's review and
     * one run's live cards with their streamed output.
     *
     * @return list<string>
     */
    public function nativeParts(): array
    {
        return [
            'BundleApprovals.vue',
            'RequestWindow.vue',
            'RunView.vue',
        ];
    }

    public function pages(): array
    {
        return [
            $this->listPage(),
            $this->requestPage(),
            $this->runsPage(),
            $this->runPage(),
            $this->runOutcomePage(),
        ];
    }

    /**
     * The data classes and enums these pages own, generated in the processes module.
     */
    public function types(): array
    {
        return [
            BundleListPartData::class,
            BundleRowData::class,
            ClassificationRuleRowData::class,
            ClassificationSummaryData::class,
            DeclarationData::class,
            ExplainedNodeData::class,
            ExplanationData::class,
            HeldPartData::class,
            PartOutputData::class,
            PartSnapshotData::class,
            PartSummaryData::class,
            ProblemData::class,
            ProposalData::class,
            ReaderProofData::class,
            RequestRowData::class,
            RequestWindowData::class,
            RunOutcomePageData::class,
            RunOutcomeSummaryData::class,
            RunRowData::class,
            RunSnapshotData::class,
            RunWindowData::class,
            SampleData::class,
            AdmissionRefusalCode::class,
            AdmissionStatus::class,
            AnalysisLimit::class,
            AssessmentOutcome::class,
            BindingType::class,
            CaptureStatus::class,
            ClaimedOutcome::class,
            ClassificationStatus::class,
            CommandClass::class,
            CommandEffect::class,
            CommandType::class,
            EmptyPolicy::class,
            EmptySelection::class,
            EvidenceSource::class,
            ExampleType::class,
            FramingType::class,
            InterpretationStatus::class,
            JournalRouteType::class,
            LifecycleStatus::class,
            NodeType::class,
            OperandType::class,
            Outcome::class,
            OutputEncoding::class,
            OutputRequirement::class,
            OutputStream::class,
            ParseOutcome::class,
            PartEndType::class,
            PartJoin::class,
            PartResultType::class,
            PositionPurpose::class,
            ProblemCode::class,
            ProgressType::class,
            ProposalStatus::class,
            RecordRole::class,
            RedirectType::class,
            RequestHoldReason::class,
            RequestStatus::class,
            ReviewLimit::class,
            RunEventType::class,
            RunLogicalResult::class,
            RunMode::class,
            RunRequestIntent::class,
            RunResultSource::class,
            ScopeType::class,
            ShellDialect::class,
            StepType::class,
            StreamUse::class,
            SummaryRule::class,
            TokenType::class,
            ToolType::class,
            UnresolvedType::class,
            UnsupportedKeyword::class,
            WordPlace::class,
            WordSegmentType::class,
        ];
    }

    /**
     * The processes pages under their own key, processes, as checked with the domains' declarations.
     */
    public function declarations(): DomainClient
    {
        return DomainClient::ofCore($this, 'Processes', 'processes');
    }

    private function listPage(): Page
    {
        return Page::layout('command-requests', 'Command review', Icon::Rules, RequestListResolver::class)
            ->at('')
            ->actions(fn (PageActions $actions) => $actions
                ->post('bundles/approval', ApproveBundlePageController::class, 'approve-rule-bundle'));
    }

    private function requestPage(): Page
    {
        return Page::layout('command-request', 'Command request', Icon::Rules, RequestWindowResolver::class)
            ->at('requests/{request}')
            ->actions(fn (PageActions $actions) => $actions
                ->post('requests/{request}/sample-approval', ApproveSamplePageController::class, 'approve-sample')
                ->post('proposals/{proposal}/approval', ApproveProposalPageController::class, 'approve-proposal')
                ->post('proposals/{proposal}/rejection', RejectProposalPageController::class, 'reject-proposal')
                ->post('rules/{rule}/retirement', RetireRulePageController::class, 'retire-rule')
                ->post('rules/{rule}/restoration', RestoreRulePageController::class, 'restore-rule'));
    }

    private function runsPage(): Page
    {
        return Page::layout('runs', 'Runs', Icon::Rules, RunListResolver::class)->at('runs');
    }

    private function runOutcomePage(): Page
    {
        return Page::make(
            'run-outcome',
            'Run outcome',
            Icon::Rules,
            RunOutcomeWindowResolver::class,
            'RunOutcomeView.vue',
        )->at('runs/{run}/outcome');
    }

    private function runPage(): Page
    {
        return Page::layout('run', 'Run', Icon::Rules, RunWindowResolver::class)
            ->at('runs/{run}')
            ->actions(fn (PageActions $actions) => $actions
                ->post('runs/{run}/stop', StopRunPageController::class, 'stop-run')
                ->post('runs/{run}/clean', CleanRunPageController::class, 'clean-run')
                ->post(
                    'runs/{run}/restored-output-check',
                    VerifyRestoredOutputPageController::class,
                    'verify-restored-output',
                ));
    }
}
