<?php

declare(strict_types=1);

namespace Domain\Helpers\Tests\Feature;

use App\Contracts\Bus\CommandBus;
use App\Contracts\Records\RecordVisibility;
use App\Events\Hooks\HelperSentOnRecord;
use App\Support\RecordIdentity;
use Domain\Helpers\Commands\StartHelper\StartHelperCommand;
use Domain\Helpers\Models\HelperIdentity;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Tests\Support\DispatchesHelpers;
use Domain\Helpers\Tests\TestCase;
use Domain\Helpers\Values\HelperWork;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;
use Tests\Support\RefreshHookDatabase;

/**
 * A helper started on a record, such as a plan to review, is announced to its parent's states with the
 * helper's agent id, so a review can count the reviewers it has out.
 */
final class HelperSentOnRecordTest extends TestCase
{
    use DispatchesHelpers;
    use RefreshHookDatabase;

    public function test_a_helper_started_on_a_plan_is_announced_with_its_agent(): void
    {
        $plan = new RecordIdentity('plans.plan', (string) Str::ulid());

        $this->app->instance(RecordVisibility::class, new class implements RecordVisibility
        {
            public function isVisible(RecordIdentity $record): bool
            {
                return true;
            }
        });

        $heard = [];

        Event::listen(HelperSentOnRecord::class, function (HelperSentOnRecord $event) use (&$heard): void {
            $heard[] = $event;
        });

        $this->app->make(CommandBus::class)->run(new StartHelperCommand(
            'request-plan',
            'plan-reviewer',
            'default',
            null,
            new HelperWork($plan, null, null, 'Review it.', [], false),
        ));

        $identity = HelperIdentity::query()->findOrFail(HelperJob::query()->sole()->helper_identity_id);
        $this->assertCount(1, $heard);
        $this->assertEquals($plan, $heard[0]->subject);
        $this->assertSame($identity->helperActor->id, $heard[0]->helperAgentId);
    }
}
