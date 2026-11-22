<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Contracts\OperationPolicy;
use App\Enums\AccessType;
use App\Enums\AnswerType;
use App\Enums\FileOperation;
use App\Support\Inputs\FileEditRequested;
use App\Support\Inputs\ToolRequested;
use App\Support\Inputs\Values\DriverToolInput;
use App\Support\Inputs\Values\FileChange;
use App\Support\Inputs\Values\FileChanges;
use App\Support\Inputs\Values\HookIdentity;
use App\Support\States\ReadyState;
use App\Support\ToolNames\Enums\ClaudeCodeTool;
use App\Values\AccessDecision;
use App\Values\AccessPolicy;
use App\Values\HostAccess;
use App\Values\Operation;
use App\Values\ProcessGrants;
use App\Values\ProfileBase;
use App\Values\ResourceRequest;
use Tests\Fixtures\Hooks\AllowedStops;
use Tests\TestCase;

/**
 * The ready bottom allows a native operation only when the session's policy grants it: reads, searches, patches,
 * and web calls, and a call with one refused part is refused whole. Shell lines are Core's admission's, and an MCP
 * tool other than the journal's is refused by name before any walk (JournalToolRecognitionTest).
 */
final class OperationPolicyTest extends TestCase
{
    public function test_a_reader_read_of_a_protected_path_is_denied(): void
    {
        $read = new Operation(
            ClaudeCodeTool::SURFACE,
            'claude:Read',
            [AccessType::Read],
            [ResourceRequest::path('/home/journal/.claude/.credentials.json')],
            [],
            1,
        );

        $decision = $this->ready(ProfileBase::readOnlyHelper()->defaultAccess())
            ->onToolRequested(new ToolRequested($this->hook(), $read));

        $this->assertSame(AnswerType::Deny, $decision->answerType());
    }

    public function test_a_reader_reads_and_searches_its_workspace(): void
    {
        $ready = $this->ready(ProfileBase::readOnlyHelper()->defaultAccess());
        $read = ClaudeCodeTool::Read->operation(new DriverToolInput(['file_path' => 'app/Models/Task.php']));
        $search = ClaudeCodeTool::Grep->operation(new DriverToolInput(['pattern' => 'Task']));

        $this->assertNull($ready->onToolRequested(new ToolRequested($this->hook(), $read)));
        $this->assertNull($ready->onToolRequested(new ToolRequested($this->hook(), $search)));
    }

    public function test_a_writer_patch_with_one_forbidden_change_is_denied_whole(): void
    {
        $writer = ProfileBase::writingHelper()->defaultAccess();
        $withoutDeletes = new AccessPolicy($writer->paths, [], ProcessGrants::everything(), [], ['file:delete']);
        $patch = new FileChanges([
            new FileChange('app/Models/Task.php', FileOperation::Edit),
            new FileChange('app/Models/Plan.php', FileOperation::Delete),
        ]);

        $decision = $this->ready($withoutDeletes)->onFileEdit(new FileEditRequested($this->hook(), $patch));

        $this->assertSame(AnswerType::Deny, $decision->answerType());
        $this->assertStringContainsString('file:delete', $decision->refusalReason());
    }

    public function test_a_web_fetch_needs_a_granted_internet_destination(): void
    {
        $fetch = ClaudeCodeTool::WebFetch->operation(new DriverToolInput(['url' => 'https://example.com']));
        $main = ProfileBase::mainAgent()->defaultAccess();
        $researcher = new AccessPolicy(
            $main->paths,
            [HostAccess::destination('*', [AccessType::Read, AccessType::Network])],
            ProcessGrants::everything(),
        );
        $request = new ToolRequested($this->hook(), $fetch);

        $this->assertSame(AnswerType::Deny, $this->ready($main)->onToolRequested($request)?->answerType());
        $this->assertNull($this->ready($researcher)->onToolRequested($request));
    }

    private function ready(AccessPolicy $access): ReadyState
    {
        return new ReadyState(new readonly class($access) implements OperationPolicy
        {
            public function __construct(private AccessPolicy $access) {}

            public function assess(Operation $operation): AccessDecision
            {
                return $this->access->decide($operation);
            }
        }, new AllowedStops());
    }

    private function hook(): HookIdentity
    {
        return new HookIdentity('01jd8x0g9m3qz6v4k2t7r5w1ca', '01jd8x0g9m3qz6v4k2t7r5w1cb', 'hook-1', 'digest');
    }
}
