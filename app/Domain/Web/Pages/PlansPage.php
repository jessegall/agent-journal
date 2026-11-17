<?php

declare(strict_types=1);

namespace App\Domain\Web\Pages;

use App\Domain\Web\Data\PlanFiltersData;
use App\Domain\Web\Data\PlanListData;
use App\Domain\Web\Views\PlansView;
use Spatie\LaravelData\Attributes\Computed;
use Spatie\LaravelData\Attributes\FromContainer;
use Spatie\LaravelData\Attributes\Hidden;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The plans page (doc 6, section 6): seeded by the filters, it projects its plans slice through the view when the page
 * is serialized, which happens once per response.
 */
#[TypeScript]
final class PlansPage extends Data
{
    public const COMPONENT = 'Plans';

    #[Computed]
    public PlanListData $plans {
        get => $this->view->plans($this->filters);
    }

    public function __construct(
        #[Hidden] public readonly PlanFiltersData $filters,
        #[Hidden, FromContainer(PlansView::class)] public readonly PlansView $view,
    ) {}

    public static function for(PlanFiltersData $filters): self
    {
        return self::from(['filters' => $filters]);
    }
}
