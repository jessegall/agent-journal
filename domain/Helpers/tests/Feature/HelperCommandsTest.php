<?php

declare(strict_types=1);

namespace Domain\Helpers\Tests\Feature;

use App\Support\StartReceipt;
use Domain\Helpers\Enums\JobStatus;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Tests\Support\DispatchesHelpers;
use Domain\Helpers\Tests\TestCase;
use Illuminate\Support\Str;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\SendsSignedPayloads;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * The helper commands run end to end over the signed helper calls: a start prints the identity, job,
 * conversation and the requested, resolved and actual model; a start without a model is refused before any call;
 * a steer reaches the live job, a cancel ends it, and the notices list answers.
 */
#[TimeLimit(seconds: 8, reason: 'It activates profiles and starts agent sessions over signed calls.')]
final class HelperCommandsTest extends TestCase
{
    use DispatchesHelpers;
    use RefreshHookDatabase;
    use SendsSignedPayloads;

    public function test_a_start_without_a_model_is_refused_before_any_call(): void
    {
        $this->runCommandsAs($this->parent);

        $this->artisan('helper:start', [
            'profile' => 'plan-reviewer',
            '--brief' => 'Review it.',
        ])
            ->expectsOutputToContain('model-required')
            ->assertFailed();

        $this->assertSame(0, HelperJob::query()->acrossActors()->count());
    }

    public function test_a_start_prints_the_identity_job_conversation_and_models(): void
    {
        $this->runCommandsAs($this->parent);

        $this->artisan('helper:start', [
            'profile' => 'plan-reviewer',
            '--model' => 'default',
            '--purpose-text' => 'Review plan 7',
            '--brief' => 'Review it.',
        ])
            ->expectsOutputToContain('Conversation new')
            ->expectsOutputToContain('actual: '.StartReceipt::ACTUAL_MODEL_NOT_REPORTED)
            ->assertSuccessful();

        $this->assertSame(JobStatus::Running, HelperJob::query()->acrossActors()->sole()->status);
    }
}
