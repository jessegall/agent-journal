<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Processes\Enums\LifecycleState;
use App\Processes\Models\ProcessRun;
use Illuminate\Testing\TestResponse;
use Inertia\Testing\AssertableInertia;
use Tests\Support\Processes\OpensAcmeRequestAsOwner;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\SendsSignedCalls;
use Tests\TestCase;

/**
 * The runs list and the run page show every part with its four observations, its output tails and its problems, a
 * result only with a receipt, and let the owner stop a run; another project's runs never show (doc 21 revision 6,
 * sections 54, 69 and 70).
 */
final class RunPageTest extends TestCase
{
    use OpensAcmeRequestAsOwner;
    use RefreshHookDatabase;
    use SendsSignedCalls;

    public function test_the_run_page_shows_each_part_with_its_output_and_no_result_without_a_receipt(): void
    {
        $part = $this->normalRun(0, "error: disk full\n".self::PASSED_OUTPUT);

        $this->page("/processes/runs/{$part->process_run_id}")->assertInertia(fn (AssertableInertia $page) => $page
            ->component('processes/RunView')
            ->where('page.data.snapshot.parts.0.operation', 'acme verify')
            ->where('page.data.snapshot.parts.0.receiptId', null)
            ->where("page.data.outputs.{$part->id}.0.stream", 'stdout'));
        $this->page('/processes/runs')->assertInertia(fn (AssertableInertia $page) => $page
            ->component('processes/RunsWindow')
            ->where('page.data.runs.0.id', $part->process_run_id));
    }

    public function test_the_owner_stops_a_running_run_and_another_project_sees_nothing(): void
    {
        $part = $this->normalRun(0, self::PASSED_OUTPUT);
        $run = ProcessRun::query()->withoutGlobalScopes()->findOrFail($part->process_run_id);
        $run->consumeFor('test-key', (string) config('app.key'));

        $this->actingAs($this->owner)->post("/processes/runs/{$run->id}/stop")->assertStatus(303);

        $this->assertSame(LifecycleState::Stopped, $run->refresh()->lifecycle);
        config(['processes.project_key' => 'another-project']);
        $this->actingAs($this->owner)->get("/processes/runs/{$run->id}")->assertNotFound();
    }

    private function page(string $path): TestResponse
    {
        return $this->actingAs($this->owner)->get($path)->assertOk();
    }
}
