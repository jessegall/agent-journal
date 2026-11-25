<?php

declare(strict_types=1);

namespace Domain\Helpers\Tests\Feature;

use App\Contracts\Actors\AgentTexts;
use App\Enums\Hooks\ContextStartType;
use App\Events\Hooks\ContextStarted;
use App\Events\Sessions\SessionStartEnded;
use App\Support\Decisions\ContextLine;
use App\Support\Inputs\ContextCompacted;
use App\Support\Inputs\SessionStarted;
use App\Support\Inputs\Values\CompactionDetails;
use App\Support\Inputs\Values\HookIdentity;
use App\Support\Inputs\Values\SessionStartDetails;
use App\Support\ReminderContribution;
use App\Support\Stack\StateFactory;
use App\Values\StackTarget;
use Domain\Helpers\Enums\JobStatus;
use Domain\Helpers\Events\HelperJobHeld;
use Domain\Helpers\Events\HelperJobSteered;
use Domain\Helpers\Listeners\SupplyHelperNotices;
use Domain\Helpers\Models\HelperIdentity;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Models\HelperPurpose;
use Domain\Helpers\Support\States\HelperJobState;
use Domain\Helpers\Support\States\Support\HelperJobStateReference;
use Domain\Helpers\Tests\Support\DispatchesHelpers;
use Domain\Helpers\Tests\TestCase;
use Domain\Helpers\Values\HelperReceipt;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\Str;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * A started helper job attaches to its session, its state gives the helper the whole job context every time its
 * context starts and ends with the job, and a parent is told the notices about its helpers' jobs once each.
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

    private const string CONTINUE_CALL = "helpers_continue with identity_id '%s'";

    public function test_a_helper_gets_its_brief_and_steering_again_after_a_compaction(): void
    {
        $receipt = $this->start((string) Str::ulid(), self::REVIEW_TITLE, self::PHASE_BRIEF);
        $job = HelperJob::query()->acrossActors()->findOrFail($receipt->jobId);
        $state = $this->jobStateOf($receipt, $job);
        $job->addSteering(self::STEERING);
        $state->onHelperJobSteered(new HelperJobSteered($job->id, self::STEERING));
        $hook = new HookIdentity('agent', 'session', 'hook', 'digest');

        $start = new SessionStartDetails('vendor', ContextStartType::Start, null);
        $started = iterator_to_array($state->onSessionStart(new SessionStarted($hook, $start)), false);

        $compacted = iterator_to_array(
            $state->onCompaction(new ContextCompacted($hook, new CompactionDetails('compaction'))),
            false,
        );

        foreach ([
            $started,
            $compacted,
        ] as $lines) {
            $context = implode("\n", array_map(
                fn (ContextLine $line) => $this->app->make(AgentTexts::class)->render($line->text),
                $lines,
            ));

            $this->assertSame(1, substr_count($context, self::PHASE_BRIEF));
            $this->assertStringContainsString(sprintf(self::STEERING_REMINDER, self::STEERING), $context);
            $this->assertStringContainsString(self::REVIEW_TITLE, $context);
        }
    }

    public function test_a_parent_sees_the_notice_of_a_lost_helper_once(): void
    {
        $receipt = $this->start((string) Str::ulid(), self::REVIEW_TITLE);
        $job = HelperJob::query()->findOrFail($receipt->jobId);
        $this->app->make(Dispatcher::class)->dispatch(new SessionStartEnded($job->assignmentIdentity()));

        $first = $this->remindersOn($this->parent->agent->id, ContextStartType::Resume);
        $again = $this->remindersOn($this->parent->agent->id, ContextStartType::Resume);

        $this->assertCount(1, $first);
        $this->assertStringContainsString(sprintf(self::CONTINUE_CALL, $receipt->identityId), $first[0]);
        $this->assertSame([], $again);
    }

    /**
     * @return list<string>
     */
    private function remindersOn(string $agentId, ContextStartType $type): array
    {
        $reminders = $this->app->make(ReminderContribution::class);

        $this->app->make(SupplyHelperNotices::class)->handle(new ContextStarted(
            new StackTarget($agentId, (string) Str::ulid()),
            'hook-'.Str::random(8),
            $type,
            $reminders,
        ));

        return $reminders->all();
    }

    private function jobStateOf(HelperReceipt $receipt, HelperJob $job): HelperJobState
    {
        $identity = HelperIdentity::query()->acrossActors()->findOrFail($receipt->identityId);
        $purpose = HelperPurpose::query()->acrossActors()->findOrFail($job->helper_purpose_id);
        $reference = HelperJobStateReference::forJob($job, $identity, $purpose->label);
        $state = $this->app->make(StateFactory::class)->frameFor($reference)->state;
        $this->assertInstanceOf(HelperJobState::class, $state);

        return $state;
    }
}
