<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Contracts\Actors\AgentTexts;
use App\Enums\ContextStartType;
use App\Enums\HookEvent;
use App\Enums\RewriteSupport;
use App\Events\ContextStarted;
use App\Support\ContextBudget;
use App\Support\Drivers\DriverCapabilities;
use App\Support\Drivers\DriverReplies;
use App\Support\Inputs\SessionStarted;
use App\Support\Inputs\Values\SessionStartDetails;
use App\Support\OperationDeadline;
use App\Support\Stack\HookAnswer;
use Domain\Memory\Models\Memory;
use Domain\Rules\Models\Rule;
use Illuminate\Support\Facades\Event;
use Tests\Support\CommittedHookStack;
use Tests\Support\HoldingRules;
use Tests\Support\InstallsBuiltInProfiles;
use Tests\Support\TestActors;
use Tests\TestCase;

/**
 * Every start, clear and resume brings the same context a compaction does: the domains' reminders, within the
 * budget with the required ones kept; a replay brings the recorded reply and runs no listener.
 */
final class SessionContextTest extends TestCase
{
    use CommittedHookStack;
    use InstallsBuiltInProfiles;

    private const string RULE_TEXT = 'No phase waits on the user.';

    private const string RULE_REMINDER = 'Rule %s: %s';

    private const string MEMORY_TEXT = 'Use plain words.';

    private const string MEMORY_REMINDER = 'Memory: %s';

    private const string OMITTED_NOTICE = '1 more reminders did not fit this context; '
        .'read your memories with memories_list.';

    private Rule $rule;

    protected function setUp(): void
    {
        parent::setUp();

        $this->rule = HoldingRules::create(self::RULE_TEXT);
        new Memory(['text' => self::MEMORY_TEXT, 'weight' => 3])->saveFor(TestActors::agentIdentity(1));
    }

    public function test_a_start_like_a_codex_start_and_a_clear_like_claude_codes_both_carry_the_reminders(): void
    {
        foreach ([
            ['call-1', ContextStartType::Start],
            ['call-2', ContextStartType::Clear],
        ] as [$callId, $source]) {
            $context = $this->start($callId, $source);

            $this->assertStringContainsString(sprintf(self::RULE_REMINDER, $this->rule->number, self::RULE_TEXT), $context);
            $this->assertStringContainsString(sprintf(self::MEMORY_REMINDER, self::MEMORY_TEXT), $context);
        }
    }

    public function test_a_replayed_start_carries_the_recorded_reminders_without_running_listeners(): void
    {
        $first = $this->start('call-1', ContextStartType::Resume);
        $received = 0;
        Event::listen(ContextStarted::class, function () use (&$received): void {
            $received++;
        });

        $again = $this->start('call-1', ContextStartType::Resume);

        $this->assertSame([$first, 0], [$again, $received]);
    }

    public function test_over_the_budget_the_required_reminders_stay_and_the_omitted_count_is_stated(): void
    {
        $this->app->instance(ContextBudget::class, new ContextBudget(5));

        $context = $this->start('call-1', ContextStartType::Start);

        $this->assertStringContainsString(sprintf(self::RULE_REMINDER, $this->rule->number, self::RULE_TEXT), $context);
        $this->assertStringNotContainsString(sprintf(self::MEMORY_REMINDER, self::MEMORY_TEXT), $context);
        $this->assertStringContainsString(
            self::OMITTED_NOTICE,
            $context,
        );
        $this->assertSame(1, Memory::query()->count());
    }

    /**
     * The additional context the SessionStart reply carries.
     */
    private function start(string $callId, ContextStartType $source): string
    {
        $this->callAs($callId, hash('sha256', $callId));
        $start = new SessionStarted(
            TestActors::hookIdentity(1, 10, $callId, hash('sha256', $callId)),
            new SessionStartDetails("native-{$callId}", $source, null),
        );
        $capabilities = new DriverCapabilities(
            'Test driver',
            'session starts',
            ['onSessionStart'],
            RewriteSupport::WithoutApproval,
        );

        $reply = $this->machine()->answer(
            $start,
            $capabilities,
            new OperationDeadline(3000),
            fn (HookAnswer $answer, AgentTexts $texts) => DriverReplies::observation(
                HookEvent::SessionStart,
                $answer,
                $texts,
            ),
        );

        return $reply->stdout;
    }
}
