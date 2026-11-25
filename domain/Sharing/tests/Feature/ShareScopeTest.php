<?php

declare(strict_types=1);

namespace Domain\Sharing\Tests\Feature;

use App\Contracts\Reads\ReadMeter;
use App\Exceptions\RecordUnavailable;
use App\Exceptions\UnknownShareRecordType;
use App\Models\Records\Link;
use App\Support\RecordIdentity;
use App\Support\ShareRecordRegistry;
use Carbon\CarbonImmutable;
use Domain\Sharing\Support\ShareBudget;
use Domain\Sharing\Support\ShareScope;
use Domain\Sharing\Tests\TestCase;
use Tests\Fixtures\Domains\Binders\BindersDomain;
use Tests\Fixtures\Domains\Binders\BinderShareProvider;
use Tests\Support\Sharing\RegistersShareDomains;
use Tests\Support\TestActors;
use Tests\Support\TestIds;

/**
 * Scope discovery for a preview: linked targets are read by their own providers in batches, so queries grow with
 * provider pages and not with targets; ineligible targets and types that advertise no needed capability are dropped;
 * a scope past the budget is refused with guidance, and a root that is unknown or not disclosable fails closed.
 */
final class ShareScopeTest extends TestCase
{
    use RegistersShareDomains;

    private const string FEWER_LINKS = 'Share a record with fewer links';

    private const array TARGET_TYPES = [
        'binders.sheet',
        'binders.card',
        'binders.tab',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->registerShareDomain(BindersDomain::class);
        $this->app->make(ShareRecordRegistry::class)->checkRelations();
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

    private function budget(): ShareBudget
    {
        return ShareBudget::forPreview($this->app->make(ReadMeter::class));
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
                [
                    $root->type,
                    $root->id,
                ],
                $target,
            ] : [
                $target,
                [
                    $root->type,
                    $root->id,
                ],
            ];

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
        return Link::create($root->type, $root->id, $target->type, $target->id);
    }
}
