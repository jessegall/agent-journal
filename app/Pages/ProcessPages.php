<?php

declare(strict_types=1);

namespace App\Pages;

use App\Contracts\Drivers\NativePartProvider;
use App\Contracts\Navigation\PageProvider;
use App\Contracts\Records\TypeProvider;
use App\Data\Pages\DeclarationData;
use App\Data\Pages\RequestWindowData;
use App\Data\Processes\BundleListPartData;
use App\Data\Processes\BundleRowData;
use App\Data\Processes\ClassificationRuleRowData;
use App\Data\Processes\ClassificationSummaryData;
use App\Data\Processes\ExplainedNodeData;
use App\Data\Processes\ExplanationData;
use App\Data\Processes\HeldPartData;
use App\Data\Processes\PartOutputData;
use App\Data\Processes\PartSnapshotData;
use App\Data\Processes\PartSummaryData;
use App\Data\Processes\ProblemData;
use App\Data\Processes\ReaderProofData;
use App\Data\Processes\RequestRowData;
use App\Data\Processes\RunOutcomePageData;
use App\Data\Processes\RunOutcomeSummaryData;
use App\Data\Processes\RunRowData;
use App\Data\Processes\RunSnapshotData;
use App\Data\Processes\RunWindowData;
use App\Data\Processes\SampleData;
use App\Data\Profiles\ProposalData;
use App\Declarations\ActionRoute;
use App\Declarations\DomainUi;
use App\Declarations\Page;
use App\Enums\AdmissionRefusalCode;
use App\Enums\AdmissionState;
use App\Enums\AnalysisLimit;
use App\Enums\AssessmentOutcome;
use App\Enums\BindingType;
use App\Enums\CaptureState;
use App\Enums\ClaimedOutcome;
use App\Enums\ClassificationState;
use App\Enums\CommandClass;
use App\Enums\CommandEffect;
use App\Enums\CommandType;
use App\Enums\EmptyPolicy;
use App\Enums\EmptySelection;
use App\Enums\EvidenceSource;
use App\Enums\ExampleType;
use App\Enums\FramingType;
use App\Enums\Icon;
use App\Enums\InterpretationState;
use App\Enums\JournalRouteType;
use App\Enums\LifecycleState;
use App\Enums\NodeType;
use App\Enums\OperandType;
use App\Enums\Outcome;
use App\Enums\OutputEncoding;
use App\Enums\OutputRequirement;
use App\Enums\OutputStream;
use App\Enums\ParseOutcome;
use App\Enums\PartEndType;
use App\Enums\PartJoin;
use App\Enums\PartResultType;
use App\Enums\PositionPurpose;
use App\Enums\ProblemCode;
use App\Enums\ProgressType;
use App\Enums\ProposalState;
use App\Enums\RecordRole;
use App\Enums\RedirectType;
use App\Enums\RequestHoldReason;
use App\Enums\RequestState;
use App\Enums\ReviewLimit;
use App\Enums\RunEventType;
use App\Enums\RunLogicalResult;
use App\Enums\RunMode;
use App\Enums\RunRequestIntent;
use App\Enums\RunResultSource;
use App\Enums\ScopeType;
use App\Enums\ShellDialect;
use App\Enums\StepType;
use App\Enums\StreamUse;
use App\Enums\SummaryRule;
use App\Enums\TokenType;
use App\Enums\ToolType;
use App\Enums\UnresolvedType;
use App\Enums\UnsupportedKeyword;
use App\Enums\WordPlace;
use App\Enums\WordSegmentType;
use App\Http\Controllers\ApproveBundlePageController;
use App\Http\Controllers\ApproveProposalPageController;
use App\Http\Controllers\ApproveSamplePageController;
use App\Http\Controllers\CleanRunPageController;
use App\Http\Controllers\RejectProposalPageController;
use App\Http\Controllers\StopRunPageController;
use App\Http\Pages\Resolvers\RequestListResolver;
use App\Http\Pages\Resolvers\RequestWindowResolver;
use App\Http\Pages\Resolvers\RunListResolver;
use App\Http\Pages\Resolvers\RunOutcomeWindowResolver;
use App\Http\Pages\Resolvers\RunWindowResolver;

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
            AdmissionState::class,
            AnalysisLimit::class,
            AssessmentOutcome::class,
            BindingType::class,
            CaptureState::class,
            ClaimedOutcome::class,
            ClassificationState::class,
            CommandClass::class,
            CommandEffect::class,
            CommandType::class,
            EmptyPolicy::class,
            EmptySelection::class,
            EvidenceSource::class,
            ExampleType::class,
            FramingType::class,
            InterpretationState::class,
            JournalRouteType::class,
            LifecycleState::class,
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
            ProposalState::class,
            RecordRole::class,
            RedirectType::class,
            RequestHoldReason::class,
            RequestState::class,
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
    public function declarations(): DomainUi
    {
        return DomainUi::ofCore($this, 'Processes', 'processes');
    }

    private function listPage(): Page
    {
        return Page::layout('command-requests', 'Command review', Icon::Rules, RequestListResolver::class)
            ->at('')
            ->actions(ActionRoute::post('bundles/approval', ApproveBundlePageController::class, 'approve-rule-bundle'));
    }

    private function requestPage(): Page
    {
        $sample = ActionRoute::post(
            'requests/{request}/sample-approval',
            ApproveSamplePageController::class,
            'approve-sample',
        );

        $approve = ActionRoute::post(
            'proposals/{proposal}/approval',
            ApproveProposalPageController::class,
            'approve-proposal',
        );

        $reject = ActionRoute::post(
            'proposals/{proposal}/rejection',
            RejectProposalPageController::class,
            'reject-proposal',
        );

        return Page::layout('command-request', 'Command request', Icon::Rules, RequestWindowResolver::class)
            ->at('requests/{request}')
            ->actions($sample, $approve, $reject);
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
            ->actions(
                ActionRoute::post('runs/{run}/stop', StopRunPageController::class, 'stop-run'),
                ActionRoute::post('runs/{run}/clean', CleanRunPageController::class, 'clean-run'),
            );
    }
}
