<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Enums\Runs\LifecycleStatus;
use App\Models\Runs\ProcessRun;
use Inertia\Testing\AssertableInertia;
use Tests\Support\Processes\OpensAcmeRequestAsOwner;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The runs list and the run page show every part with its four observations, its output tails and its problems, a
 * result only with a receipt, and let the owner stop a run; another project's runs never show.
 */
final class RunPageTest extends TestCase
{
    use OpensAcmeRequestAsOwner;
    use RefreshHookDatabase;

    public function test_the_owner_stops_a_running_run_and_another_project_sees_nothing(): void
    {
        $part = $this->normalRun(0, self::PASSED_OUTPUT);
        $run = ProcessRun::query()->withoutGlobalScopes()->findOrFail($part->process_run_id);
        $run->consumeFor('test-key', (string) config('app.key'));

        $this->actingAs($this->journal->ownerUser())->post("/processes/runs/{$run->id}/stop")->assertStatus(303);

        $this->assertSame(LifecycleStatus::Stopped, $run->refresh()->lifecycle);
        config(['processes.project_key' => 'another-project']);
        $this->actingAs($this->journal->ownerUser())->get("/processes/runs/{$run->id}")->assertOk()->assertInertia(fn (
            AssertableInertia $page,
        ) => $page->where('page.data.root.key', 'removed')->where('page.data.root.children.1.key', 'back'));
    }
}
