<?php

declare(strict_types=1);

namespace Tests\Feature\Sharing;

use App\Links\Models\Link;
use App\Reads\Contracts\ReadMeter;
use App\Records\Exceptions\RecordUnavailable;
use App\Records\Support\RecordIdentity;
use App\Sharing\Exceptions\ShareScopeTooLarge;
use App\Sharing\Exceptions\UnknownShareRecordType;
use App\Sharing\Support\MeteredShareBudget;
use App\Sharing\Support\ShareLinkedCandidate;
use App\Sharing\Support\ShareRecordRegistry;
use App\Sharing\Support\ShareScope;
use Carbon\CarbonImmutable;
use Tests\Fixtures\Domains\Binders\BindersDomain;
use Tests\Fixtures\Domains\Binders\BinderShareProvider;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\Sharing\RegistersShareDomains;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * Scope discovery for a preview: linked targets are read by their own providers in batches, so queries grow with
 * provider pages and not with targets; ineligible targets and types that advertise no needed capability are dropped;
 * a scope past the budget is refused with guidance, and a root that is unknown or not disclosable fails closed.
 */
final class ShareScopeTest extends TestCase
{
    use RefreshHookDatabase, RegistersShareDomains;

    private const array TARGET_TYPES = ['binders.sheet', 'binders.card', 'binders.tab'];

    protected function setUp(): void
    {
        parent::setUp();

        $this->registerShareDomain(BindersDomain::class);
        $this->app->make(ShareRecordRegistry::class)->checkRelations();
    }

    public function test_queries_grow_with_provider_pages_not_with_targets(): void
    {
        $small = $this->root(1);
        $large = $this->root(2);
        $this->linkTargets($small, 30, 1_000);
        $this->linkTargets($large, 300, 2_000);

        $smallBudget = $this->budget();
        $smallScope = $this->scope()->discover($small, $smallBudget);
        $largeBudget = $this->budget();
        $largeScope = $this->scope()->discover($large, $largeBudget);

        $this->assertCount(30, $smallScope->linked);
        $this->assertCount(300, $largeScope->linked);
        $this->assertSame($smallBudget->queries(), $largeBudget->queries());
        $this->assertSame(1 + count(self::TARGET_TYPES), $largeBudget->queries());
    }

    public function test_an_ineligible_target_and_a_type_without_the_capability_never_appear(): void
    {
        $root = $this->root(1);
        $this->linkTargets($root, 3, 1_000);
        $this->link($root, new RecordIdentity('binders.sheet', BinderShareProvider::INELIGIBLE_ID));
        $memo = $this->link($root, TestActors::record('binders.memo', 5_000));

        $candidates = $this->scope()->discover($root, $this->budget());
        $ids = array_map(fn (ShareLinkedCandidate $candidate) => $candidate->card->record->id, $candidates->linked);

        $this->assertCount(3, $ids);
        $this->assertNotContains(BinderShareProvider::INELIGIBLE_ID, $ids);
        $this->assertNotContains($memo->target_id, $ids);
        $this->assertSame($root, $candidates->linked[0]->source);
    }

    public function test_1001_candidates_are_refused_with_guidance(): void
    {
        $root = $this->root(1);
        $this->linkTargets($root, 1_001, 1_000);

        $this->assertThrows(
            fn () => $this->scope()->discover($root, $this->budget()),
            ShareScopeTooLarge::class,
            'Share a record with fewer links',
        );
    }

    public function test_an_unregistered_or_hidden_root_fails_closed(): void
    {
        $this->assertThrows(
            fn () => $this->scope()->discover(TestActors::record('binders.unknown', 1), $this->budget()),
            UnknownShareRecordType::class,
        );
        $this->assertThrows(
            fn () => $this->scope()->discover(
                new RecordIdentity('binders.binder', BinderShareProvider::HIDDEN_ROOT_ID),
                $this->budget(),
            ),
            RecordUnavailable::class,
        );
    }

    private function scope(): ShareScope
    {
        return $this->app->make(ShareScope::class);
    }

    private function budget(): MeteredShareBudget
    {
        return MeteredShareBudget::forPreview($this->app->make(ReadMeter::class));
    }

    private function root(int $number): RecordIdentity
    {
        return TestActors::record('binders.binder', $number);
    }

    /**
     * Links the root to as many targets, spread over the three shareable types, half of them from the other side.
     */
    private function linkTargets(RecordIdentity $root, int $count, int $firstNumber): void
    {
        $now = CarbonImmutable::now();
        $rows = [];

        for ($number = 0; $number < $count; $number++) {
            $target = [self::TARGET_TYPES[$number % 3], TestIds::of($firstNumber + $number)];
            [$source, $other] = $number % 2 === 0 ? [
                [$root->type, $root->id],
                $target,
            ] : [$target, [$root->type, $root->id]];
            $rows[] = [
                'id' => strtolower((string) str()->ulid()),
                'source_type' => $source[0],
                'source_id' => $source[1],
                'target_type' => $other[0],
                'target_id' => $other[1],
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        Link::query()->insert($rows);
    }

    private function link(RecordIdentity $root, RecordIdentity $target): Link
    {
        return Link::recorded($root->type, $root->id, $target->type, $target->id);
    }
}
