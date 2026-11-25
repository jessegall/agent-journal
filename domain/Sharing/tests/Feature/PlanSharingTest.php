<?php

declare(strict_types=1);

namespace Domain\Sharing\Tests\Feature;

use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Reads\ReadMeter;
use App\Models\Records\Link;
use App\Support\ShareContentRead;
use App\Support\ShareRecordRegistry;
use App\Values\OwnerAuthority;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\Models\Document;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Models\Plan;
use Domain\Plans\Support\PlanStructure;
use Domain\Sharing\Support\ShareBudget;
use Domain\Sharing\Support\ShareLinkedCandidate;
use Domain\Sharing\Support\ShareScope;
use Domain\Sharing\Tests\TestCase;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestActors;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * A plan is shared as a summary root: it previews with its title, its linked document is a candidate read through the
 * Documents provider, and no phase or task appears in anything a provider returns.
 */
#[TimeLimit(seconds: 5, reason: 'It commits a document through the bus and empties twelve tables around each test.')]
final class PlanSharingTest extends TestCase
{
    use CommitsHookRows;

    private const string PLAN_TITLE = 'Version 6';

    private const string SECRET_PHASE = 'Secret phase';

    /**
     * The bus commits these commands for real, so these tables are emptied around each test.
     */
    private const array TABLES = [
        'links',
        'comments',
        'document_closes',
        'document_drafts',
        'reports',
        'document_revisions',
        'documents',
        'phase_tasks',
        'phases',
        'plans',
        'tasks',
        'number_groups',
    ];

    public function test_a_plan_previews_as_a_summary_root_with_its_linked_document_as_a_candidate(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(TestActors::user(1), new OwnerAuthority('test'));
        $this->app->make(CommandBus::class)->run(new CreateDocumentCommand('Design', 'What we build', <<<'TEXT'
        # Goal
        Ship it.

        TEXT));
        $document = Document::query()->where('number', 1)->sole();
        $plan = Plan::factory()->create([
            'title' => self::PLAN_TITLE,
            'type' => PlanType::Build,
        ]);
        $this->planStructure()->addPhase($plan, self::SECRET_PHASE);
        Link::createForModels($plan, $document);

        $candidates = $this->app->make(ShareScope::class)->discover($plan->shareIdentity(), $this->budget());
        $content = $this->app->make(ShareRecordRegistry::class)->provider(Plan::linkType())->content(
            new ShareContentRead($plan->shareIdentity()),
            $this->budget(),
        );

        $this->assertSame(self::PLAN_TITLE, $candidates->root->title);
        $this->assertSame(
            [$document->id],
            array_map(fn (ShareLinkedCandidate $candidate) => $candidate->recordId(), $candidates->linked),
        );
        $this->assertSame('Design', $candidates->linked[0]->card->title);
        $this->assertStringContainsString(self::PLAN_TITLE, $content->body);
        $this->assertStringNotContainsString(self::SECRET_PHASE, $content->body);
        $this->assertStringNotContainsString(self::SECRET_PHASE, (string) json_encode($candidates));
    }

    private function budget(): ShareBudget
    {
        return ShareBudget::forPreview($this->app->make(ReadMeter::class));
    }

    private function planStructure(): PlanStructure
    {
        return $this->app->make(PlanStructure::class);
    }
}
