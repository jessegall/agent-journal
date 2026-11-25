<?php

declare(strict_types=1);

namespace Domain\Memory\Tests\Feature;

use App\Contracts\Actors\AgentTexts;
use App\Enums\Drivers\RewriteSupport;
use App\Enums\Hooks\ContextStartType;
use App\Support\Drivers\DriverCapabilities;
use App\Support\Inputs\ContextCompacted;
use App\Support\Inputs\Contracts\HookInput;
use App\Support\Inputs\SessionStarted;
use App\Support\Inputs\Values\CompactionDetails;
use App\Support\Inputs\Values\HookIdentity;
use App\Support\Inputs\Values\SessionStartDetails;
use Domain\Memory\Tests\Fixtures\MemoryFixtures;
use Domain\Memory\Tests\TestCase;
use Illuminate\Support\Facades\Schema;
use Tests\Support\CommitsHookRows;

/**
 * An agent's memories reach every context start, on any program, and keep the weight the agent gave them.
 */
final class MemoryContextTest extends TestCase
{
    use CommitsHookRows;

    /**
     * A hook commits its call and the memory's delivery, so these tables are emptied around each test.
     */
    private const array TABLES = ['memories', 'agent_stacks', 'hook_calls'];

    private const string MEMORY_REMINDER = 'Memory: Run migrate:fresh after a create-migration edit.';

    private MemoryFixtures $memories;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner()->agent('Keeper');
        $this->memories = $this->journal->fixtures(MemoryFixtures::class)
            ->memory('Migrate', 'Keeper', 'Run migrate:fresh after a create-migration edit.', 6);
    }

    public function test_no_memory_compactions_table_is_built(): void
    {
        $this->assertFalse(Schema::hasTable('memory_compactions'));
    }

    public function test_a_claude_code_compaction_delivers_the_memory_and_keeps_its_weight(): void
    {
        $context = $this->answer(
            new ContextCompacted($this->identity('call-1'), new CompactionDetails('call-1')),
            'onCompaction',
        );

        $this->assertStringContainsString(self::MEMORY_REMINDER, $context);
        $this->assertSame(6, $this->memories->memoryCalled('Migrate')->refresh()->weight);
    }

    public function test_a_start_on_the_other_program_delivers_the_same_memory_and_keeps_its_weight(): void
    {
        $this->answer(new ContextCompacted($this->identity('call-1'), new CompactionDetails('call-1')), 'onCompaction');

        $context = $this->answer(
            new SessionStarted(
                $this->identity('call-2'),
                new SessionStartDetails('codex-thread-1', ContextStartType::Start, null),
            ),
            'onSessionStart',
        );

        $this->assertStringContainsString(self::MEMORY_REMINDER, $context);
        $this->assertSame(6, $this->memories->memoryCalled('Migrate')->refresh()->weight);
    }

    private function identity(string $callId): HookIdentity
    {
        $session = $this->journal->sessionOf('Keeper');

        return new HookIdentity($session->agent_id, $session->id, $callId, hash('sha256', $callId));
    }

    /**
     * The context the program is shown for the hook.
     */
    private function answer(HookInput $input, string $method): string
    {
        $driver = new DriverCapabilities('Test program', 'context starts', [$method], RewriteSupport::WithoutApproval);
        $answer = $this->journal->answerHook($this->journal->sessionOf('Keeper'), $input, $driver);

        return implode("\n", $answer->shownContext($this->journal->service(AgentTexts::class)));
    }
}
