<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Domains\Support\DomainEntry;
use App\Processes\Enums\RequestState;
use App\Processes\Models\ModuleRuleBundle;
use App\Processes\Models\RuleProposal;
use App\Processes\Support\CommandRuleRegistry;
use Illuminate\Testing\TestResponse;
use Inertia\Testing\AssertableInertia;
use Tests\Fixtures\Modules\Notes\NotesDomain;
use Tests\Support\Processes\OpensAcmeRequestAsOwner;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\SendsSignedCalls;
use Tests\TestCase;

/**
 * The owner's command review pages: the project's requests, rules and waiting bundles, and one request with its
 * proposal, samples and readers, from which the owner approves a sample, approves or rejects, and activates a bundle;
 * nothing of another project shows (doc 21 revision 6, sections 51 and 71; stories 81-86, 89, 92, 96, 182, 186, 191).
 */
final class RequestReviewPageTest extends TestCase
{
    use OpensAcmeRequestAsOwner;
    use RefreshHookDatabase;
    use SendsSignedCalls;

    public function test_the_list_shows_the_projects_requests_and_nothing_of_another_project(): void
    {
        $this->listPage()->assertInertia(fn (AssertableInertia $page) => $page
            ->component('processes/RequestsWindow')
            ->where('page.data.requests.0.id', $this->requestId)
            ->where('page.data.requests.0.state', RequestState::AwaitingSampleApproval->value));

        config(['processes.project_key' => 'another-project']);

        $this->listPage()->assertInertia(fn (AssertableInertia $page) => $page
            ->where('page.data.requests', []));
        $this->actingAs($this->owner)->get("/processes/requests/{$this->requestId}")->assertNotFound();
    }

    public function test_the_request_page_shows_the_declaration_and_the_owner_approves_its_sample(): void
    {
        $this->actingAs($this->owner)->get("/processes/requests/{$this->requestId}")->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('processes/RequestWindow')
                ->where('page.data.proposals.0.revisions.0.operation', 'acme verify')
                ->where('page.data.proposals.0.revisions.0.classes', ['read'])
                ->where('page.data.lineDigest', $this->request()->source_digest));

        $this->actingAs($this->owner)->post("/processes/requests/{$this->requestId}/sample-approval", [
            'expected_revision' => 1,
            'command_digest' => $this->request()->source_digest,
        ])->assertStatus(303);

        $this->assertSame(RequestState::ReadyForSample, $this->request()->state);
    }

    public function test_an_approval_without_a_proof_is_shown_as_a_refusal_and_a_rejection_stays_visible(): void
    {
        $proposal = RuleProposal::query()->sole();

        $this->actingAs($this->owner)
            ->post("/processes/proposals/{$proposal->id}/approval", ['expected_revision' => 1, 'reason' => 'ok'])
            ->assertStatus(303)
            ->assertSessionHasErrors('review');

        $this->actingAs($this->owner)
            ->post("/processes/proposals/{$proposal->id}/rejection", ['reason' => 'effects too wide'])
            ->assertStatus(303);

        $this->assertSame(RequestState::Rejected, $this->request()->state);
        $this->listPage()->assertInertia(fn (AssertableInertia $page) => $page
            ->where('page.data.requests.0.state', RequestState::Rejected->value));
    }

    public function test_a_waiting_module_bundle_is_activated_from_the_list(): void
    {
        $registry = CommandRuleRegistry::from(DomainEntry::fromClass(NotesDomain::class)->commandRules());
        $this->app->instance(CommandRuleRegistry::class, $registry);
        $bundle = $registry->bundles()[0];

        $this->listPage()->assertInertia(fn (AssertableInertia $page) => $page
            ->where('page.data.bundles.0.digest', $bundle->digest()));

        $this->actingAs($this->owner)->post('/processes/bundles/approval', [
            'module' => $bundle->module,
            'version' => $bundle->version,
            'digest' => $bundle->digest(),
        ])->assertStatus(303);

        $this->assertSame(1, ModuleRuleBundle::query()->count());
    }

    private function listPage(): TestResponse
    {
        return $this->actingAs($this->owner)->get('/processes')->assertOk();
    }
}
