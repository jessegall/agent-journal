<?php

declare(strict_types=1);

namespace Domain\Helpers\Tests\Commands;

use App\Contracts\Bus\CommandBus;
use App\Enums\Agents\ConversationModeType;
use App\Models\Agents\Agent;
use Carbon\CarbonImmutable;
use Domain\Helpers\Commands\SendHelper\SendHelperCommand;
use Domain\Helpers\Exceptions\HelperBusy;
use Domain\Helpers\Exceptions\HelperJobUnfinished;
use Domain\Helpers\Exceptions\HelperRetired;
use Domain\Helpers\Exceptions\HelperUnavailable;
use Domain\Helpers\Models\HelperIdentity;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Tests\Support\DispatchesHelpers;
use Domain\Helpers\Tests\TestCase;
use Domain\Helpers\Values\HelperReceipt;
use Domain\Helpers\Values\HelperWork;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * A parent sends a helper it already has new work: the helper keeps the identity it names on a new conversation, and
 * a busy, unfinished, retired or foreign helper refuses with its own refusal.
 */
#[TimeLimit(seconds: 5, reason: 'It activates profiles and starts agent sessions for several dispatches.')]
final class SendHelperTest extends TestCase
{
    use DispatchesHelpers;
    use RefreshHookDatabase;

    public function test_a_send_with_a_new_subject_keeps_the_named_identity_and_starts_a_new_conversation(): void
    {
        $first = $this->start('request-1', 'Review plan 7');
        $this->finish($first);

        $sent = $this->send('request-2', $first->identityId, 'Review plan 8');

        $this->assertSame($first->identityId, $sent->identityId);
        $this->assertFalse($sent->startDetails->isNewIdentity);
        $this->assertSame(ConversationModeType::New, $sent->startDetails->conversationMode);
    }

    public function test_a_busy_unfinished_retired_or_foreign_helper_refuses_with_its_own_refusal(): void
    {
        $busy = $this->start('request-1', 'Review plan 7');
        $this->assertThrows(fn () => $this->send('request-2', $busy->identityId, 'Review plan 8'), HelperBusy::class);

        HelperJob::query()->findOrFail($busy->jobId)->markUnfinished('stop:1');
        $this->endSessionOf($busy);

        $this->assertThrows(
            fn () => $this->send('request-3', $busy->identityId, 'Review plan 8'),
            HelperJobUnfinished::class,
        );

        HelperJob::query()->findOrFail($busy->jobId)->cancel();
        $this->agentOf($busy)->retireAt(CarbonImmutable::now());

        $this->assertThrows(
            fn () => $this->send('request-4', $busy->identityId, 'Review plan 8'),
            HelperRetired::class,
        );

        $other = $this->journal->signedStart('Test agent');
        $other->startRequest($this->app);

        $this->assertThrows(
            fn () => $this->send('request-5', $busy->identityId, 'Review plan 8'),
            HelperUnavailable::class,
        );
    }

    private function send(string $requestId, string $identityId, string $purpose): HelperReceipt
    {
        return $this->app->make(CommandBus::class)->run(new SendHelperCommand(
            $requestId,
            $identityId,
            'plan-reviewer',
            'default',
            null,
            new HelperWork(null, null, $purpose, 'Review it.', [], false),
        ));
    }

    private function finish(HelperReceipt $receipt): void
    {
        HelperJob::query()->findOrFail($receipt->jobId)->finish('report:1');
        $this->endSessionOf($receipt);
    }

    private function agentOf(HelperReceipt $receipt): Agent
    {
        $identity = HelperIdentity::query()->findOrFail($receipt->identityId);

        return Agent::query()->findOrFail($identity->helper_actor_id);
    }
}
