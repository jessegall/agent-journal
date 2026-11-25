<?php

declare(strict_types=1);

namespace Domain\Memory\Tests\Feature;

use App\Contracts\Actors\AgentTexts;
use App\Enums\Drivers\RewriteSupport;
use App\Enums\Hooks\ContextStartType;
use App\Enums\Hooks\HookEvent;
use App\Models\Agents\Agent;
use App\Support\ActorIdentity;
use App\Support\Drivers\DriverCapabilities;
use App\Support\Drivers\DriverReplies;
use App\Support\Inputs\ContextCompacted;
use App\Support\Inputs\Contracts\HookInput;
use App\Support\Inputs\SessionStarted;
use App\Support\Inputs\Values\CompactionDetails;
use App\Support\Inputs\Values\HookIdentity;
use App\Support\Inputs\Values\SessionStartDetails;
use App\Support\OperationDeadline;
use App\Support\Stack\HookAnswer;
use Domain\Memory\Models\Memory;
use Domain\Memory\Tests\TestCase;
use Illuminate\Support\Facades\Schema;
use Tests\Support\CommittedHookStack;
use Tests\Support\TestIds;

/**
 * An agent's memories reach every context start, on any program, and keep the weight the agent gave them.
 */
final class MemoryContextTest extends TestCase
{
    use CommittedHookStack;

    private const string MEMORY_REMINDER = 'Memory: Run migrate:fresh after a create-migration edit.';

    private Memory $memory;

    protected function setUp(): void
    {
        parent::setUp();

        $this->memory = Memory::create(
            ActorIdentity::ofClass(Agent::class, TestIds::of(1)),
            'Run migrate:fresh after a create-migration edit.',
            6,
        );
    }

    public function test_no_memory_compactions_table_is_built(): void
    {
        $this->assertFalse(Schema::hasTable('memory_compactions'));
    }

    public function test_a_claude_code_compaction_delivers_the_memory_and_keeps_its_weight(): void
    {
        $context = $this->answer(
            'call-1',
            new ContextCompacted($this->identity('call-1'), new CompactionDetails('call-1')),
            'onCompaction',
        );

        $this->assertStringContainsString(self::MEMORY_REMINDER, $context);
        $this->assertSame(6, $this->memory->refresh()->weight);
    }

    public function test_a_start_on_the_other_program_delivers_the_same_memory_and_keeps_its_weight(): void
    {
        $this->answer(
            'call-1',
            new ContextCompacted($this->identity('call-1'), new CompactionDetails('call-1')),
            'onCompaction',
        );

        $context = $this->answer(
            'call-2',
            new SessionStarted(
                $this->identity('call-2'),
                new SessionStartDetails('codex-thread-1', ContextStartType::Start, null),
            ),
            'onSessionStart',
        );

        $this->assertStringContainsString(self::MEMORY_REMINDER, $context);
        $this->assertSame(6, $this->memory->refresh()->weight);
    }

    private function identity(string $callId): HookIdentity
    {
        return new HookIdentity(TestIds::of(1), TestIds::of(10), $callId, hash('sha256', $callId));
    }

    private function answer(string $callId, HookInput $input, string $method): string
    {
        $this->callAs($callId, hash('sha256', $callId));

        $capabilities = new DriverCapabilities(
            'Test program',
            'context starts',
            [$method],
            RewriteSupport::WithoutApproval,
        );

        return $this->machine()->answer(
            $input,
            $capabilities,
            new OperationDeadline(3000),
            fn (HookAnswer $answer, AgentTexts $texts) => DriverReplies::observation(
                HookEvent::SessionStart,
                $answer,
                $texts,
            ),
        )->stdout;
    }
}
