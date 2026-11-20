<?php

declare(strict_types=1);

namespace Domain\Helpers\Tests\Feature;

use App\Agents\Events\LaunchEnded;
use App\Agents\Support\StackTarget;
use App\Hooks\Enums\ContextStartType;
use App\Hooks\Events\ContextStarted;
use App\Hooks\Support\ContextReminders;
use Domain\Helpers\Listeners\SupplyHelperContext;
use Domain\Helpers\Models\HelperIdentity;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Support\HelperReceipt;
use Domain\Helpers\Tests\Support\DispatchesHelpers;
use Domain\Helpers\Tests\TestCase;
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

    public function test_a_helper_gets_its_brief_and_steering_again_after_a_compaction(): void
    {
        $receipt = $this->start((string) Str::ulid(), 'Review plan 7', 'Read every phase.');
        HelperJob::query()->findOrFail($receipt->jobId)->addSteering('Look at the tests too');

        $started = $this->remindersOn($this->helperAgentOf($receipt), ContextStartType::Start);
        $compacted = $this->remindersOn($this->helperAgentOf($receipt), ContextStartType::Compact);

        foreach ([$started, $compacted] as $reminders) {
            $this->assertCount(1, $reminders);
            $this->assertStringContainsString('Read every phase.', $reminders[0]);
            $this->assertStringContainsString('Steering from your parent: Look at the tests too', $reminders[0]);
            $this->assertStringContainsString('Review plan 7', $reminders[0]);
        }
    }

    public function test_a_parent_sees_the_notice_of_a_lost_helper_once(): void
    {
        $receipt = $this->start((string) Str::ulid(), 'Review plan 7');
        $job = HelperJob::query()->findOrFail($receipt->jobId);
        $this->app->make(Dispatcher::class)->dispatch(new LaunchEnded($job->assignmentIdentity()));

        $first = $this->remindersOn($this->parent->agent->id, ContextStartType::Resume);
        $again = $this->remindersOn($this->parent->agent->id, ContextStartType::Resume);

        $this->assertCount(1, $first);
        $this->assertStringContainsString("journal helper continue '{$receipt->identityId}'", $first[0]);
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
