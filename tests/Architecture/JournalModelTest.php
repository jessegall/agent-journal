<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Models\Support\HasUlidKey;
use App\Models\Support\JournalModel;
use App\Support\Reflector;
use Tests\Architecture\Support\ProjectModels;
use Tests\Fixtures\JournalModels\Models\LooseRecord;
use Tests\TestCase;

/**
 * Every model is a journal model: it extends JournalModel, or, when it must extend another Laravel base, uses
 * HasUlidKey, so its key is always a ULID string.
 */
final class JournalModelTest extends TestCase
{
    private const string HOW_TO_FIX = 'Extend App\Models\Support\JournalModel, or use HasUlidKey on a model that must '
        .'extend another Laravel base:';

    public function test_every_model_of_app_and_the_domains_is_a_journal_model(): void
    {
        $this->assertSame([], self::looseModels(ProjectModels::all()), self::HOW_TO_FIX);
    }

    public function test_a_model_on_eloquents_own_base_is_named(): void
    {
        $models = ProjectModels::in([base_path('tests/Fixtures/JournalModels')]);

        $this->assertSame([LooseRecord::class], self::looseModels($models));
    }

    /**
     * @param  list<class-string>  $models
     * @return list<class-string>
     */
    private static function looseModels(array $models): array
    {
        return array_values(array_filter(
            $models,
            fn (string $model) => Reflector::of($model)->not()->isSubclassOf(JournalModel::class)
                && Reflector::of($model)->not()->uses(HasUlidKey::class),
        ));
    }
}
