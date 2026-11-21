<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Actors\Contracts\PolicyCatalogue;
use App\Profiles\Support\BuiltInAuthorizations;
use App\Profiles\Values\ProfileBase;
use Tests\TestCase;

/**
 * Every built-in base is granted exactly the policy accesses reviewed here, in this order (doc 79, phase 1): a change
 * to how a policy or an access type restricts its grants that gives a profile one more or one fewer fails here.
 */
final class BuiltInGrantsTest extends TestCase
{
    /**
     * The reviewed grants of each base, as policy and access.
     */
    private const array GRANTS = [
        'main-agent' => [
            ['Domain\\Tasks\\Policies\\TaskPolicy', 'read'],
            ['Domain\\Tasks\\Policies\\TaskPolicy', 'create'],
            ['Domain\\Tasks\\Policies\\TaskPolicy', 'edit'],
            ['Domain\\Tasks\\Policies\\TaskRunPolicy', 'create'],
            ['Domain\\Tasks\\Policies\\TaskRunPolicy', 'edit'],
            ['Domain\\Plans\\Policies\\PlanPolicy', 'read'],
            ['Domain\\Plans\\Policies\\PlanPolicy', 'create'],
            ['Domain\\Plans\\Policies\\PlanPolicy', 'edit'],
            ['Domain\\Documents\\Policies\\DocumentPolicy', 'create'],
            ['Domain\\Documents\\Policies\\DocumentPolicy', 'edit'],
            ['Domain\\Documents\\Policies\\ReportPolicy', 'create'],
            ['Domain\\Documents\\Policies\\ReportPolicy', 'edit'],
            ['Domain\\Documents\\Policies\\UploadPolicy', 'create'],
            ['Domain\\Documents\\Policies\\UploadPolicy', 'edit'],
            ['Domain\\Chat\\Policies\\MessagePinPolicy', 'edit'],
            ['Domain\\Chat\\Policies\\ConversationPolicy', 'edit'],
            ['Domain\\Memory\\Policies\\MemoryPolicy', 'read'],
            ['Domain\\Memory\\Policies\\MemoryPolicy', 'create'],
            ['Domain\\Memory\\Policies\\MemoryPolicy', 'edit'],
            ['Domain\\Rules\\Policies\\RulePolicy', 'read'],
            ['Domain\\Rules\\Policies\\RulePolicy', 'create'],
            ['Domain\\Sequences\\Policies\\SequencePolicy', 'create'],
            ['Domain\\Helpers\\Policies\\HelperPolicy', 'create'],
            ['Domain\\Helpers\\Policies\\HelperPolicy', 'edit'],
            ['Domain\\Helpers\\Policies\\HelperPolicy', 'delegate'],
            ['App\\Skills\\Policies\\SkillPolicy', 'read'],
            ['App\\Profiles\\Policies\\ProfileDraftPolicy', 'edit'],
            ['App\\Supervision\\Policies\\SupervisorPolicy', 'edit'],
            ['App\\Supervision\\Policies\\AskPolicy', 'edit'],
            ['App\\Agents\\Policies\\AgentPolicy', 'create'],
            ['App\\Agents\\Policies\\AgentPolicy', 'edit'],
            ['App\\Agents\\Policies\\AgentPolicy', 'delete'],
            ['App\\Assignments\\Policies\\AssignmentPolicy', 'read'],
            ['App\\Assignments\\Policies\\AssignmentPolicy', 'create'],
            ['App\\Assignments\\Policies\\AssignmentPolicy', 'edit'],
            ['App\\Assignments\\Policies\\AssignmentRecipientPolicy', 'create'],
            ['App\\Assignments\\Policies\\AssignmentRecipientPolicy', 'delegate'],
            ['App\\Assignments\\Policies\\AssignmentRecipientPolicy', 'delete'],
            ['App\\Records\\Policies\\RecordLinkPolicy', 'create'],
            ['App\\Records\\Policies\\RecordLinkPolicy', 'edit'],
            ['App\\Sharing\\Policies\\ShareRequestPolicy', 'create'],
            ['App\\Communication\\Policies\\MessagePolicy', 'read'],
            ['App\\Communication\\Policies\\MessagePolicy', 'create'],
            ['App\\Communication\\Policies\\MessagePolicy', 'edit'],
            ['App\\Comments\\Policies\\CommentPolicy', 'create'],
            ['App\\Processes\\Policies\\ProcessPolicy', 'read'],
            ['App\\Processes\\Policies\\ProcessPolicy', 'create'],
            ['App\\Processes\\Policies\\ProcessPolicy', 'edit'],
            ['App\\Processes\\Policies\\ProcessPolicy', 'execute'],
            ['App\\Processes\\Policies\\ProcessPolicy', 'test'],
        ],
        'writing-helper' => [
            ['Domain\\Tasks\\Policies\\TaskPolicy', 'read'],
            ['Domain\\Tasks\\Policies\\TaskPolicy', 'create'],
            ['Domain\\Tasks\\Policies\\TaskPolicy', 'edit'],
            ['Domain\\Tasks\\Policies\\TaskRunPolicy', 'create'],
            ['Domain\\Tasks\\Policies\\TaskRunPolicy', 'edit'],
            ['Domain\\Plans\\Policies\\PlanPolicy', 'read'],
            ['Domain\\Plans\\Policies\\PlanPolicy', 'create'],
            ['Domain\\Plans\\Policies\\PlanPolicy', 'edit'],
            ['Domain\\Documents\\Policies\\DocumentPolicy', 'create'],
            ['Domain\\Documents\\Policies\\DocumentPolicy', 'edit'],
            ['Domain\\Documents\\Policies\\ReportPolicy', 'create'],
            ['Domain\\Documents\\Policies\\ReportPolicy', 'edit'],
            ['Domain\\Documents\\Policies\\UploadPolicy', 'create'],
            ['Domain\\Documents\\Policies\\UploadPolicy', 'edit'],
            ['Domain\\Chat\\Policies\\MessagePinPolicy', 'edit'],
            ['Domain\\Chat\\Policies\\ConversationPolicy', 'edit'],
            ['Domain\\Memory\\Policies\\MemoryPolicy', 'read'],
            ['Domain\\Memory\\Policies\\MemoryPolicy', 'create'],
            ['Domain\\Memory\\Policies\\MemoryPolicy', 'edit'],
            ['Domain\\Rules\\Policies\\RulePolicy', 'read'],
            ['Domain\\Rules\\Policies\\RulePolicy', 'create'],
            ['Domain\\Sequences\\Policies\\SequencePolicy', 'create'],
            ['Domain\\Helpers\\Policies\\HelperPolicy', 'create'],
            ['Domain\\Helpers\\Policies\\HelperPolicy', 'edit'],
            ['App\\Skills\\Policies\\SkillPolicy', 'read'],
            ['App\\Profiles\\Policies\\ProfileDraftPolicy', 'edit'],
            ['App\\Supervision\\Policies\\AskPolicy', 'edit'],
            ['App\\Agents\\Policies\\AgentPolicy', 'create'],
            ['App\\Agents\\Policies\\AgentPolicy', 'edit'],
            ['App\\Assignments\\Policies\\AssignmentPolicy', 'read'],
            ['App\\Assignments\\Policies\\AssignmentPolicy', 'create'],
            ['App\\Assignments\\Policies\\AssignmentPolicy', 'edit'],
            ['App\\Assignments\\Policies\\AssignmentRecipientPolicy', 'create'],
            ['App\\Records\\Policies\\RecordLinkPolicy', 'create'],
            ['App\\Records\\Policies\\RecordLinkPolicy', 'edit'],
            ['App\\Sharing\\Policies\\ShareRequestPolicy', 'create'],
            ['App\\Communication\\Policies\\MessagePolicy', 'read'],
            ['App\\Communication\\Policies\\MessagePolicy', 'create'],
            ['App\\Communication\\Policies\\MessagePolicy', 'edit'],
            ['App\\Comments\\Policies\\CommentPolicy', 'create'],
            ['App\\Processes\\Policies\\ProcessPolicy', 'read'],
            ['App\\Processes\\Policies\\ProcessPolicy', 'create'],
            ['App\\Processes\\Policies\\ProcessPolicy', 'edit'],
            ['App\\Processes\\Policies\\ProcessPolicy', 'execute'],
            ['App\\Processes\\Policies\\ProcessPolicy', 'test'],
        ],
        'read-only-helper' => [
            ['Domain\\Tasks\\Policies\\TaskPolicy', 'read'],
            ['Domain\\Tasks\\Policies\\TaskPolicy', 'create'],
            ['Domain\\Tasks\\Policies\\TaskPolicy', 'edit'],
            ['Domain\\Tasks\\Policies\\TaskRunPolicy', 'create'],
            ['Domain\\Tasks\\Policies\\TaskRunPolicy', 'edit'],
            ['Domain\\Plans\\Policies\\PlanPolicy', 'read'],
            ['Domain\\Plans\\Policies\\PlanPolicy', 'create'],
            ['Domain\\Plans\\Policies\\PlanPolicy', 'edit'],
            ['Domain\\Documents\\Policies\\ReportPolicy', 'create'],
            ['Domain\\Documents\\Policies\\ReportPolicy', 'edit'],
            ['Domain\\Documents\\Policies\\UploadPolicy', 'create'],
            ['Domain\\Documents\\Policies\\UploadPolicy', 'edit'],
            ['Domain\\Chat\\Policies\\MessagePinPolicy', 'edit'],
            ['Domain\\Memory\\Policies\\MemoryPolicy', 'read'],
            ['Domain\\Memory\\Policies\\MemoryPolicy', 'create'],
            ['Domain\\Memory\\Policies\\MemoryPolicy', 'edit'],
            ['Domain\\Rules\\Policies\\RulePolicy', 'read'],
            ['Domain\\Rules\\Policies\\RulePolicy', 'create'],
            ['Domain\\Sequences\\Policies\\SequencePolicy', 'create'],
            ['Domain\\Helpers\\Policies\\HelperPolicy', 'create'],
            ['Domain\\Helpers\\Policies\\HelperPolicy', 'edit'],
            ['App\\Skills\\Policies\\SkillPolicy', 'read'],
            ['App\\Profiles\\Policies\\ProfileDraftPolicy', 'edit'],
            ['App\\Supervision\\Policies\\AskPolicy', 'edit'],
            ['App\\Agents\\Policies\\AgentPolicy', 'create'],
            ['App\\Agents\\Policies\\AgentPolicy', 'edit'],
            ['App\\Assignments\\Policies\\AssignmentPolicy', 'read'],
            ['App\\Assignments\\Policies\\AssignmentPolicy', 'create'],
            ['App\\Assignments\\Policies\\AssignmentPolicy', 'edit'],
            ['App\\Assignments\\Policies\\AssignmentRecipientPolicy', 'create'],
            ['App\\Records\\Policies\\RecordLinkPolicy', 'create'],
            ['App\\Records\\Policies\\RecordLinkPolicy', 'edit'],
            ['App\\Sharing\\Policies\\ShareRequestPolicy', 'create'],
            ['App\\Communication\\Policies\\MessagePolicy', 'read'],
            ['App\\Communication\\Policies\\MessagePolicy', 'create'],
            ['App\\Communication\\Policies\\MessagePolicy', 'edit'],
            ['App\\Comments\\Policies\\CommentPolicy', 'create'],
            ['App\\Processes\\Policies\\ProcessPolicy', 'read'],
            ['App\\Processes\\Policies\\ProcessPolicy', 'create'],
            ['App\\Processes\\Policies\\ProcessPolicy', 'edit'],
            ['App\\Processes\\Policies\\ProcessPolicy', 'execute'],
        ],
    ];

    public function test_each_built_in_base_is_granted_exactly_its_reviewed_accesses(): void
    {
        $definitions = $this->app->make(PolicyCatalogue::class)->definitions();

        foreach (ProfileBase::all() as $base) {
            $grants = array_map(
                fn (array $grant) => [$grant['policy'], $grant['access']],
                BuiltInAuthorizations::for($base, $definitions)->grantsAsArrays(),
            );

            $this->assertSame(self::GRANTS[$base->key], $grants, $base->key);
        }
    }
}
