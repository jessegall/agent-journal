<?php

declare(strict_types=1);

namespace App\Domain\Web\Pages;

use App\Domain\Web\Data\RuleFiltersData;
use App\Domain\Web\Data\RuleListData;
use App\Domain\Web\Views\RulesView;
use Spatie\LaravelData\Attributes\Computed;
use Spatie\LaravelData\Attributes\FromContainer;
use Spatie\LaravelData\Attributes\Hidden;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The rules page: the list and the reader of the selected rule on one page, seeded by the filters.
 */
#[TypeScript]
final class RulesPage extends Data
{
    public const string COMPONENT = 'Rules';

    #[Computed]
    public RuleListData $rules {
        get => $this->view->rules($this->filters);
    }

    public function __construct(
        #[Hidden] public readonly RuleFiltersData $filters,
        #[Hidden, FromContainer(RulesView::class)] public readonly RulesView $view,
    ) {}

    public static function for(RuleFiltersData $filters): self
    {
        return self::from(['filters' => $filters]);
    }
}
