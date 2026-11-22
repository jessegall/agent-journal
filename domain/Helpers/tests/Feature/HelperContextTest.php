<?php

declare(strict_types=1);

namespace Domain\Helpers\Tests\Feature;

use App\Enums\ContextStartType;
use App\Events\ContextStarted;
use App\Events\LaunchEnded;
use App\Support\ContextReminders;
use App\Values\StackTarget;
use Domain\Helpers\Listeners\SupplyHelperContext;
use Domain\Helpers\Models\HelperIdentity;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Tests\Support\DispatchesHelpers;
use Domain\Helpers\Tests\TestCase;
use Domain\Helpers\Values\HelperReceipt;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\Str;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * A helper is given its whole job context every time its context starts, and a parent the notices about its
 * helpers' jobs once each (task 291).
 */
#[TimeLimit(seconds: 6, reason: 'It activates profiles and starts agent sessions for a dispatch.')]
final class HelperContextTest extends TestCase
{
    use DispatchesHelpers;
    use RefreshHookDatabase;

    private const string PHASE_BRIEF = 'Read every phase.';

    private const string STEERING = 'Look at the tests too';

    private const string STEERING_REMINDER = 'Steering from your parent: %s';

    private const string REVIEW_TITLE = 'Review plan 7';

    private const string CONTINUE_COMMAND = "journal helper continue '%s'";

    public function test_a_helper_gets_its_brief_and_steering_again_after_a_compaction(): void
    {
        $receipt = $this->start((string) Str::ulid(), self::REVIEW_TITLE, self::PHASE_BRIEF);
        HelperJob::query()->findOrFail($receipt->jobId)->addSteering(self::STEERING);

        $started = $this->remindersOn($this->helperAgentOf($receipt), ContextStartType::Start);
        $compacted = $this->remindersOn($this->helperAgentOf($receipt), ContextStartType::Compact);

        foreach ([$started, $compacted] as $reminders) {
            $this->assertCount(1, $reminders);
            $this->assertStringContainsString(self::PHASE_BRIEF, $reminders[0]);
            $this->assertStringContainsString(sprintf(self::STEERING_REMINDER, self::STEERING), $reminders[0]);
            $this->assertStringContainsString(self::REVIEW_TITLE, $reminders[0]);
        }
    }

    public function test_a_parent_sees_the_notice_of_a_lost_helper_once(): void
    {
        $receipt = $this->start((string) Str::ulid(), self::REVIEW_TITLE);
        $job = HelperJob::query()->findOrFail($receipt->jobId);
        $this->app->make(Dispatcher::class)->dispatch(new LaunchEnded($job->assignmentIdentity()));

        $first = $this->remindersOn($this->parent->agent->id, ContextStartType::Resume);
        $again = $this->remindersOn($this->parent->agent->id, ContextStartType::Resume);

        $this->assertCount(1, $first);
        $this->assertStringContainsString(sprintf(self::CONTINUE_COMMAND, $receipt->identityId), $first[0]);
        $this->assertSame([], $again);
    }

    /**
     * @return list<string>
     */
    private function remindersOn(string $agentId, ContextStartType $type): array
    {
        $reminders = $this->app->make(ContextReminders::class);

        $this->app->make(SupplyHelperContext::class)->handle(new ContextStarted(
            new StackTarget($agentId, (string) Str::ulid()),
            'hook-'.Str::random(8),
            $type,
            $reminders,
        ));

        return $reminders->all();
    }

    private function helperAgentOf(HelperReceipt $receipt): string
    {
        return HelperIdentity::query()->findOrFail($receipt->identityId)->helper_actor_id;
    }
}
