<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Domain\DomainEntry;
use App\Domain\DomainRegistry;
use Tests\Architecture\Support\BoundaryReport;
use Tests\Architecture\Support\DomainFiles;
use Tests\Architecture\Support\ModelConventions;
use Tests\Architecture\Support\Violation;
use Tests\Fixtures\Models\Shop\ShopDomain;
use Tests\TestCase;

/**
 * Every domain and core model lists its fillable attributes with #[Fillable([...])] only, and no model is open to mass assignment.
 */
final class DomainModelConventionTest extends TestCase
{
    public function test_each_model_is_judged_by_what_laravel_really_does_with_it(): void
    {
        $violations = ModelConventions::modelViolations(DomainFiles::in([$this->fixtureFolder().'/Models']));

        $this->assertSame([
            'AttributeAndPropertyModel' => 'fillable-not-listed',
            'EmptyGuardedModel' => 'open-model',
            'EmptyGuardedPropertyModel' => 'open-model',
            'EmptyListModel' => 'fillable-not-listed',
            'InheritedPropertyModel' => 'fillable-not-listed',
            'NoAttributeModel' => 'fillable-not-listed',
            'OpenPivot' => 'open-model',
            'PropertyOnlyModel' => 'fillable-not-listed',
            'UnguardedModel' => 'open-model',
        ], $this->kindsByModel($violations));
    }

    public function test_every_call_that_opens_a_model_fails(): void
    {
        $violations = ModelConventions::openingCalls(DomainFiles::in([$this->fixtureFolder().'/Calls']));

        $this->assertSame(
            ['forceCreate()', 'forceFill()', 'guard()', 'mergeFillable()', 'fillable()', 'unguard()', 'unguarded()'],
            array_map(fn (Violation $violation) => $violation->used, $violations),
        );
    }

    public function test_the_models_of_the_domains_and_the_core_follow_rule_six(): void
    {
        $files = DomainFiles::in([
            ...array_map(fn (DomainEntry $entry) => $entry->folder, $this->app->make(DomainRegistry::class)->all()),
            app_path('Core'),
        ]);
        $violations = [...ModelConventions::modelViolations($files), ...ModelConventions::openingCalls($files)];

        $this->assertSame([], $violations, BoundaryReport::of($violations, base_path()));
    }

    /**
     * @param  list<Violation>  $violations
     * @return array<string, string>
     */
    private function kindsByModel(array $violations): array
    {
        $kinds = [];

        foreach ($violations as $violation) {
            $kinds[class_basename($violation->used)] = $violation->kind->value;
        }

        ksort($kinds);

        return $kinds;
    }

    private function fixtureFolder(): string
    {
        return DomainRegistry::from([ShopDomain::class])->get('Shop')->folder;
    }
}
