<?php

declare(strict_types=1);

namespace Tests\Feature\Sharing;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Bus\Contracts\CommandBus;
use App\Reads\Contracts\ReadMeter;
use App\Sharing\Support\MeteredShareBudget;
use App\Sharing\Support\ShareContentRead;
use App\Sharing\Support\ShareLinkedCandidate;
use App\Sharing\Support\ShareRecordRegistry;
use App\Sharing\Support\ShareScope;
use Domain\Documents\Commands\CreateDocument;
use Domain\Documents\Models\Document;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Models\Plan;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A plan is shared as a summary root: it previews with its title, its linked document is a candidate read through the
 * Documents provider, and no phase or task appears in anything a provider returns.
 */
#[TimeLimit(seconds: 5, reason: 'It commits a document through the bus and empties twelve tables around each test.')]
final class PlanSharingTest extends TestCase
{
    use CommitsHookRows;

    /**
     * The bus commits these commands for real, so these tables are emptied around each test.
     */
    private const array TABLES = ['links', 'comments', 'document_closes', 'document_drafts', 'reports', 'document_revisions', 'documents', 'phase_tasks', 'phases', 'plans', 'tasks', 'number_groups'];

    public function test_a_plan_previews_as_a_summary_root_with_its_linked_document_as_a_candidate(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser(TestIds::of(1)));
        $this->app->make(CommandBus::class)->run(new CreateDocument('Design', 'What we build', "# Goal\nShip it.\n"));
        $document = Document::query()->where('number', 1)->sole();
        $plan = Plan::query()->create(['title' => 'Version 6', 'type' => PlanType::Build]);
        $plan->addPhase('Secret phase');
        $plan->linkTo($document);

        $candidates = $this->app->make(ShareScope::class)->discover($plan->shareIdentity(), $this->budget());
        $content = $this->app->make(ShareRecordRegistry::class)->provider(Plan::LINK_TYPE)->content(new ShareContentRead($plan->shareIdentity()), $this->budget());

        $this->assertSame('Version 6', $candidates->root->title);
        $this->assertSame([$document->id], array_map(fn (ShareLinkedCandidate $candidate) => $candidate->card->record->id, $candidates->linked));
        $this->assertSame('Design', $candidates->linked[0]->card->title);
        $this->assertStringContainsString('Version 6', $content->body);
        $this->assertStringNotContainsString('Secret phase', $content->body);
        $this->assertStringNotContainsString('Secret phase', (string) json_encode($candidates));
    }

    private function budget(): MeteredShareBudget
    {
        return MeteredShareBudget::forPreview($this->app->make(ReadMeter::class));
    }
}
