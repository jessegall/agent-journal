<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Bus\Support\OperationDeadline;
use App\Hooks\Enums\RewriteSupport;
use App\Hooks\Enums\SessionStartSource;
use App\Hooks\Events\ContextStarted;
use App\Hooks\Inputs\HookIdentity;
use App\Hooks\Inputs\SessionStartDetails;
use App\Hooks\Inputs\SessionStarted;
use App\Hooks\Programs\ProgramCapabilities;
use App\Hooks\Programs\ProgramReplies;
use App\Hooks\Stack\HookAnswer;
use App\Hooks\Support\ContextBudget;
use Domain\Memory\Models\Memory;
use Domain\Rules\Models\Rule;
use Illuminate\Support\Facades\Event;
use Tests\Support\CommittedHookStack;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * Every launch, clear and resume brings the same context a compaction does: the domains' reminders, within the
 * budget with the required ones kept; a replay brings the recorded reply and runs no listener.
 */
final class SessionContextTest extends TestCase
{
    use CommittedHookStack;

    private Rule $rule;

    protected function setUp(): void
    {
        parent::setUp();

        $this->rule = Rule::holding('No phase waits on the user.');
        new Memory(['text' => 'Use plain words.', 'weight' => 3])->saveFor(TestActors::agentIdentity(1));
    }

    public function test_a_launch_like_a_codex_start_and_a_clear_like_claude_codes_both_carry_the_reminders(): void
    {
        foreach ([['call-1', SessionStartSource::Startup], ['call-2', SessionStartSource::Clear]] as [$callId, $source]) {
            $context = $this->start($callId, $source);

            $this->assertStringContainsString("Rule {$this->rule->id}: No phase waits on the user.", $context);
            $this->assertStringContainsString('Memory: Use plain words.', $context);
        }
    }

    public function test_a_replayed_start_carries_the_recorded_reminders_without_running_listeners(): void
    {
        $first = $this->start('call-1', SessionStartSource::Resume);
        $heard = 0;
        Event::listen(ContextStarted::class, function () use (&$heard): void {
            $heard++;
        });

        $again = $this->start('call-1', SessionStartSource::Resume);

        $this->assertSame([$first, 0], [$again, $heard]);
    }

    public function test_over_the_budget_the_required_reminders_stay_and_the_omitted_count_is_stated(): void
    {
        $this->app->instance(ContextBudget::class, new ContextBudget(5));

        $context = $this->start('call-1', SessionStartSource::Startup);

        $this->assertStringContainsString("Rule {$this->rule->id}: No phase waits on the user.", $context);
        $this->assertStringNotContainsString('Memory: Use plain words.', $context);
        $this->assertStringContainsString('1 more reminders did not fit this context; read your memories with journal memory list.', $context);
        $this->assertSame(1, Memory::query()->count());
    }

    /**
     * The additional context the SessionStart reply carries.
     */
    private function start(string $callId, SessionStartSource $source): string
    {
        $this->callAs($callId, hash('sha256', $callId));
        $start = new SessionStarted(new HookIdentity(TestIds::of(1), TestIds::of(10), $callId, hash('sha256', $callId)), new SessionStartDetails("native-{$callId}", $source));
        $capabilities = new ProgramCapabilities('Test program', 'session starts', ['onSessionStart'], RewriteSupport::WithoutApproval);

        $reply = $this->machine()->answer($start, $capabilities, new OperationDeadline(3000), fn (HookAnswer $answer) => ProgramReplies::observation('SessionStart', $answer));

        return $reply->stdout;
    }
}
